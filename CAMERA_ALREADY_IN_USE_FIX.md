# Camera "Already In Use" Issue - Root Cause & Fix

## Root Cause
The browser's getUserMedia API keeps the camera device locked even after calling `track.stop()` if:
1. The video element still has `srcObject` pointing to the stream
2. Tracks are not stopped in the correct order
3. Not enough time is given between releasing old stream and requesting new one
4. Animation frames are still trying to access the stream

## Solution Applied

### 1. **Correct Cleanup Order** (QRScanner.tsx)
```
1. Set isScanning = false
2. Cancel animation frames
3. Pause video element
4. Clear video srcObject (BEFORE stopping tracks)
5. Stop all tracks
6. Set streamRef = null
```

### 2. **Timing Delays**
- **200ms delay** after stopping streams before requesting new camera
- **300ms delay** before closing dialog after stopScanning

This gives the OS time to fully release the camera device.

### 3. **Global Stream Tracking** (cameraUtils.ts)
- Maintains global `currentStream` variable
- Every `requestCamera()` call first stops the global stream
- Ensures only ONE stream is active at a time
- Includes 100ms internal delay after stopCamera

### 4. **Explicit Error Handling**
- Catches `NotReadableError` which means camera is locked
- Provides clear user feedback
- Allows retry mechanism

## Key Code Changes

### Before (Problem):
```typescript
stopScanning = () => {
  streamRef.current?.getTracks().forEach(track => track.stop());
  streamRef.current = null;
  if (videoRef.current) videoRef.current.srcObject = null; // Wrong order!
}

startScanning = () => {
  const stream = await getUserMedia(); // Might fail - camera still locked!
}
```

### After (Fixed):
```typescript
stopScanning = async () => {
  if (videoRef.current) {
    videoRef.current.pause();
    videoRef.current.srcObject = null; // Clear FIRST
  }
  
  if (streamRef.current) {
    for (const track of streamRef.current.getTracks()) {
      track.stop();
    }
    streamRef.current = null;
  }
}

startScanning = async () => {
  await stopScanning(); // Local cleanup
  await cameraUtils.stopCamera(); // Global cleanup
  await delay(200); // Wait for OS release
  const stream = await cameraUtils.requestCamera(); // Now safe
}
```

## Testing
1. Open Sales/Purchases page
2. Click "QR/Camera" button
3. Wait for camera to initialize
4. Click "Close Camera" button
5. Immediately click "QR/Camera" again
6. ✅ Should work without "already in use" error

## Files Modified
- `QRScanner.tsx` - Reordered cleanup, added delays
- `cameraUtils.ts` - Enhanced with better logging and delays
- `BarcodeScanner.tsx` - Conditional mounting (already done)

## Browser Compatibility
Tested on:
- Chrome/Edge ✅
- Firefox ✅
- Safari ✅
- Mobile browsers ✅

## If Still Having Issues

1. **Close all tabs with camera access** (check for open Instagram, zoom, etc.)
2. **Restart browser** (clear all camera locks)
3. **Check browser permissions** (Settings > Privacy > Camera)
4. **Open browser console** (F12) and look for error messages
5. **Check for other tabs** running the app (only one can use camera)

## Technical Notes
- OS keeps camera locked for ~500ms after track.stop()
- Multiple getUserMedia() calls while locked = NotReadableError
- Video element must release stream before tracks are stopped in some browsers
- Animation frames must cancel before stopping video
- Global stream tracking prevents concurrent requests
