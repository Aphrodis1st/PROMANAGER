import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Link,
  Paper,
  Snackbar,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";
import {
  AssignmentInd,
  AttachFile,
  Build,
  Close,
  FactCheck,
  History,
  Info,
  LocalPolice,
  Refresh,
  SwapHoriz,
  TrendingDown,
  Visibility,
} from "@mui/icons-material";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api/v1";
const ASSET_API_URL = `${API_BASE_URL}/stock/assets-management`;

const authConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

const tabs = [
  { key: "general", label: "General Information", icon: <Info fontSize="small" /> },
  { key: "assignmentHistory", label: "Assignment History", icon: <AssignmentInd fontSize="small" /> },
  { key: "transferHistory", label: "Transfer History", icon: <SwapHoriz fontSize="small" /> },
  { key: "maintenanceHistory", label: "Maintenance History", icon: <Build fontSize="small" /> },
  { key: "depreciationHistory", label: "Depreciation History", icon: <TrendingDown fontSize="small" /> },
  { key: "insuranceHistory", label: "Insurance History", icon: <LocalPolice fontSize="small" /> },
  { key: "auditHistory", label: "Audit History", icon: <FactCheck fontSize="small" /> },
  { key: "attachments", label: "Attachments", icon: <AttachFile fontSize="small" /> },
  { key: "activityTimeline", label: "Activity Timeline", icon: <History fontSize="small" /> },
];

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value?.toDate ? value.toDate() : value);
  return Number.isNaN(date.getTime()) ? "-" : date.toISOString().slice(0, 10);
};

const formatMoney = (amount, currency = "RWF") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount || 0));

const labelize = (value) =>
  value.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase()).trim();

const statusColor = (status = "") => {
  const normalized = String(status).toLowerCase();
  if (["active", "verified", "approved", "completed", "posted"].includes(normalized)) return "success";
  if (["pending", "planned", "requested", "open", "in_progress"].includes(normalized)) return "warning";
  if (["expired", "failed", "disposed", "rejected"].includes(normalized)) return "error";
  return "default";
};

const getAssetName = (asset) => asset?.assetName || asset?.name || asset?.title || "-";
const getAssetCode = (asset) => asset?.assetCode || asset?.code || asset?.tagNumber || "-";
const getAssetCost = (asset) => Number(asset?.cost || asset?.purchaseCost || asset?.assetCost || 0);
const getBookValue = (asset) =>
  Number(asset?.bookValue ?? getAssetCost(asset) - Number(asset?.accumulatedDepreciation || 0));

function Field({ label, value }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: "uppercase" }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 650, color: "grey.900", wordBreak: "break-word" }}>
        {value || "-"}
      </Typography>
    </Box>
  );
}

function EmptyState({ label }) {
  return (
    <Box sx={{ p: 4, border: "1px dashed", borderColor: "grey.300", borderRadius: 1, bgcolor: "grey.50", textAlign: "center" }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "grey.800" }}>
        No {label.toLowerCase()} recorded
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
        Matching records for this asset will appear here.
      </Typography>
    </Box>
  );
}

function RecordsPanel({ records, label, currency }) {
  if (!records.length) return <EmptyState label={label} />;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      {records.map((record, index) => (
        <Paper key={record.id || `${label}-${index}`} variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, mb: 1.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
              {record.title || record.name || record.description || record.action || `${label} ${index + 1}`}
            </Typography>
            {record.status && <Chip label={record.status} size="small" color={statusColor(record.status)} />}
          </Box>
          <Grid container spacing={2}>
            {Object.entries(record)
              .filter(([key]) => !["id", "_id", "assetId", "assetName", "title", "name"].includes(key))
              .map(([key, raw]) => {
                const lower = key.toLowerCase();
                const value =
                  lower.includes("date") || lower.includes("at")
                    ? formatDate(raw)
                    : lower.includes("cost") || lower.includes("value") || lower.includes("amount")
                    ? formatMoney(raw, currency)
                    : Array.isArray(raw)
                    ? raw.join(", ")
                    : raw || "-";

                return (
                  <Grid item xs={12} sm={6} md={4} key={key}>
                    <Field label={labelize(key)} value={value} />
                  </Grid>
                );
              })}
          </Grid>
        </Paper>
      ))}
    </Box>
  );
}

function AttachmentsPanel({ records }) {
  if (!records.length) return <EmptyState label="Attachments" />;

  return (
    <Grid container spacing={2}>
      {records.map((file, index) => (
        <Grid item xs={12} md={6} key={file.id || `file-${index}`}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 1, height: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <AttachFile sx={{ color: "#0d9488" }} />
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }} noWrap>
                  {file.fileName || file.name || file.title || `Attachment ${index + 1}`}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {file.documentType || file.type || "Document"} | {formatDate(file.createdAt || file.uploadedAt)}
                </Typography>
              </Box>
            </Box>
            {(file.url || file.fileUrl || file.link) && (
              <Link href={file.url || file.fileUrl || file.link} target="_blank" rel="noreferrer" sx={{ mt: 1.5, display: "inline-flex", fontWeight: 700 }}>
                Open file
              </Link>
            )}
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}

function GeneralPanel({ asset }) {
  const currency = asset.currency || "RWF";

  return (
    <Grid container spacing={2.5}>
      <Grid item xs={12} sm={6} md={4}><Field label="Asset Name" value={getAssetName(asset)} /></Grid>
      <Grid item xs={12} sm={6} md={4}><Field label="Asset Code" value={getAssetCode(asset)} /></Grid>
      <Grid item xs={12} sm={6} md={4}><Field label="Serial Number" value={asset.serialNumber} /></Grid>
      <Grid item xs={12} sm={6} md={4}><Field label="Category" value={asset.category} /></Grid>
      <Grid item xs={12} sm={6} md={4}><Field label="Subcategory" value={asset.subcategory} /></Grid>
      <Grid item xs={12} sm={6} md={4}><Field label="Lifecycle Status" value={asset.lifecycleStatus || asset.status} /></Grid>
      <Grid item xs={12} sm={6} md={4}><Field label="Verification Status" value={asset.verificationStatus} /></Grid>
      <Grid item xs={12} sm={6} md={4}><Field label="Location" value={asset.locationName || asset.location} /></Grid>
      <Grid item xs={12} sm={6} md={4}><Field label="Department" value={asset.departmentName || asset.department} /></Grid>
      <Grid item xs={12} sm={6} md={4}><Field label="Custodian" value={asset.custodianName || asset.assignedTo} /></Grid>
      <Grid item xs={12} sm={6} md={4}><Field label="Purchase Date" value={formatDate(asset.purchaseDate || asset.acquisitionDate)} /></Grid>
      <Grid item xs={12} sm={6} md={4}><Field label="Purchase Cost" value={formatMoney(getAssetCost(asset), currency)} /></Grid>
      <Grid item xs={12} sm={6} md={4}><Field label="Book Value" value={formatMoney(getBookValue(asset), currency)} /></Grid>
      <Grid item xs={12} sm={6} md={4}><Field label="Useful Life" value={asset.usefulLifeYears ? `${asset.usefulLifeYears} years` : "-"} /></Grid>
      <Grid item xs={12} sm={6} md={4}><Field label="Warranty Status" value={asset.warrantyStatus} /></Grid>
    </Grid>
  );
}

function AssetDetailsDialog({ asset, related, open, onClose }) {
  const [tab, setTab] = useState("general");
  const currency = asset?.currency || "RWF";

  useEffect(() => {
    if (open) setTab("general");
  }, [open, asset?.id]);

  if (!asset) return null;

  const counts = {
    assignmentHistory: related.assignmentHistory.length,
    transferHistory: related.transferHistory.length,
    maintenanceHistory: related.maintenanceHistory.length,
    depreciationHistory: related.depreciationHistory.length,
    insuranceHistory: related.insuranceHistory.length,
    auditHistory: related.auditHistory.length,
    attachments: related.attachments.length,
    activityTimeline: related.activityTimeline.length,
  };

  const renderPanel = () => {
    if (tab === "general") return <GeneralPanel asset={asset} />;
    if (tab === "attachments") return <AttachmentsPanel records={related.attachments} />;
    const selected = tabs.find((item) => item.key === tab);
    return <RecordsPanel records={related[tab] || []} label={selected?.label || "Records"} currency={currency} />;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
      <DialogTitle sx={{ p: 0 }}>
        <Box sx={{ px: 3, py: 2.5, bgcolor: "#0f172a", color: "white", display: "flex", justifyContent: "space-between", gap: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 850 }}>{getAssetName(asset)}</Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.72)", mt: 0.25 }}>
              {getAssetCode(asset)} | {asset.locationName || "No location"} | {formatMoney(getBookValue(asset), currency)}
            </Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: "white", alignSelf: "flex-start" }} aria-label="Close asset details">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "grey.50" }}>
          <Tabs value={tab} onChange={(_, value) => setTab(value)} variant="scrollable" scrollButtons="auto" sx={{ px: 2 }}>
            {tabs.map((item) => (
              <Tab
                key={item.key}
                value={item.key}
                icon={item.icon}
                iconPosition="start"
                label={item.key === "general" ? item.label : `${item.label} (${counts[item.key] || 0})`}
                sx={{ minHeight: 56, textTransform: "none", fontWeight: 700 }}
              />
            ))}
          </Tabs>
        </Box>
        <Box sx={{ p: 3 }}>{renderPanel()}</Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, borderTop: 1, borderColor: "divider" }}>
        <Button onClick={onClose} variant="outlined">Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function AssetManagementAssetsPage() {
  const [assets, setAssets] = useState([]);
  const [relatedRecords, setRelatedRecords] = useState({
    transfers: [],
    maintenance: [],
    audits: [],
    depreciation: [],
    documents: [],
  });
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const assetsRes = await axios.get(`${ASSET_API_URL}/assets`, authConfig());
      setAssets(assetsRes.data?.data?.assets || assetsRes.data?.data?.items || []);

      const [transfersRes, maintenanceRes, auditsRes, depreciationRes, documentsRes] = await Promise.allSettled([
        axios.get(`${ASSET_API_URL}/transfers`, authConfig()),
        axios.get(`${ASSET_API_URL}/maintenance`, authConfig()),
        axios.get(`${ASSET_API_URL}/audits`, authConfig()),
        axios.get(`${ASSET_API_URL}/depreciation`, authConfig()),
        axios.get(`${ASSET_API_URL}/documents`, authConfig()),
      ]);

      const getItems = (result) =>
        result.status === "fulfilled" ? result.value.data?.data?.items || [] : [];

      setRelatedRecords({
        transfers: getItems(transfersRes),
        maintenance: getItems(maintenanceRes),
        audits: getItems(auditsRes),
        depreciation: getItems(depreciationRes),
        documents: getItems(documentsRes),
      });
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to load asset records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const selectedRelated = useMemo(() => {
    if (!selectedAsset) {
      return {
        assignmentHistory: [],
        transferHistory: [],
        maintenanceHistory: [],
        depreciationHistory: [],
        insuranceHistory: [],
        auditHistory: [],
        attachments: [],
        activityTimeline: [],
      };
    }

    const assetId = selectedAsset.id;
    const assetName = getAssetName(selectedAsset);
    const matchesAsset = (record) =>
      record.assetId === assetId ||
      record.assetCode === selectedAsset.code ||
      record.assetCode === selectedAsset.assetCode ||
      record.assetName === assetName;

    const assignmentHistory = Array.isArray(selectedAsset.assignmentHistory) ? selectedAsset.assignmentHistory : [];
    const insuranceHistory = Array.isArray(selectedAsset.insuranceHistory) ? selectedAsset.insuranceHistory : [];
    const inlineAttachments = Array.isArray(selectedAsset.attachments) ? selectedAsset.attachments : [];
    const inlineActivity = Array.isArray(selectedAsset.activityTimeline || selectedAsset.activities)
      ? selectedAsset.activityTimeline || selectedAsset.activities
      : [];

    const transferHistory = relatedRecords.transfers.filter(matchesAsset);
    const maintenanceHistory = relatedRecords.maintenance.filter(matchesAsset);
    const depreciationHistory = relatedRecords.depreciation.filter(matchesAsset);
    const auditHistory = relatedRecords.audits.filter(matchesAsset);
    const documentAttachments = relatedRecords.documents.filter(matchesAsset);

    const generatedActivity = [
      ...assignmentHistory.map((item) => ({ ...item, type: item.type || "Assignment" })),
      ...transferHistory.map((item) => ({ ...item, type: item.type || "Transfer" })),
      ...maintenanceHistory.map((item) => ({ ...item, type: item.type || "Maintenance" })),
      ...depreciationHistory.map((item) => ({ ...item, type: item.type || "Depreciation" })),
      ...insuranceHistory.map((item) => ({ ...item, type: item.type || "Insurance" })),
      ...auditHistory.map((item) => ({ ...item, type: item.type || "Audit" })),
    ].sort((a, b) => new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0));

    return {
      assignmentHistory,
      transferHistory,
      maintenanceHistory,
      depreciationHistory,
      insuranceHistory,
      auditHistory,
      attachments: [...inlineAttachments, ...documentAttachments],
      activityTimeline: inlineActivity.length ? inlineActivity : generatedActivity,
    };
  }, [selectedAsset, relatedRecords]);

  const totals = useMemo(() => {
    const totalCost = assets.reduce((sum, asset) => sum + getAssetCost(asset), 0);
    const totalBookValue = assets.reduce((sum, asset) => sum + getBookValue(asset), 0);
    const verified = assets.filter((asset) => asset.verificationStatus === "verified").length;
    return { totalCost, totalBookValue, verified };
  }, [assets]);

  return (
    <Box sx={{ p: 3, minHeight: "100vh", bgcolor: "grey.50" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: { xs: "flex-start", md: "center" }, gap: 2, mb: 3, flexDirection: { xs: "column", md: "row" } }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 850, color: "grey.900" }}>Assets</Typography>
          <Typography variant="body2" color="text.secondary">
            Professional asset register with full history tabs for each asset record.
          </Typography>
        </Box>
        <Button startIcon={<Refresh />} variant="outlined" onClick={loadData} disabled={loading}>
          Refresh
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2.25, borderRadius: 1 }} elevation={1}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>Total Assets</Typography>
            <Typography variant="h5" sx={{ fontWeight: 850 }}>{assets.length}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2.25, borderRadius: 1 }} elevation={1}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>Total Cost</Typography>
            <Typography variant="h5" sx={{ fontWeight: 850 }}>{formatMoney(totals.totalCost)}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2.25, borderRadius: 1, borderLeft: "4px solid #0d9488" }} elevation={1}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>Verified Assets</Typography>
            <Typography variant="h5" sx={{ fontWeight: 850 }}>{totals.verified}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper elevation={1} sx={{ borderRadius: 1, overflow: "hidden" }}>
        <Box sx={{ px: 2.5, py: 2, borderBottom: 1, borderColor: "divider", bgcolor: "white", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 850, color: "grey.900" }}>
              Assets Register
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Click an asset row or the view icon to open the professional history tabs.
            </Typography>
          </Box>
          <Chip label={`${assets.length} records`} size="small" color="primary" />
        </Box>
        {loading ? (
          <Box sx={{ py: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 1.5 }}>
            <CircularProgress size={26} />
            <Typography color="text.secondary">Loading assets...</Typography>
          </Box>
        ) : (
          <Box sx={{ overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "grey.100" }}>
                  <TableCell sx={{ fontWeight: 800 }}>Asset</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Code</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Location</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Custodian</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Book Value</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800 }}>View</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assets.length ? (
                  assets.map((asset) => (
                    <TableRow key={asset.id} hover sx={{ cursor: "pointer" }} onClick={() => setSelectedAsset(asset)}>
                      <TableCell sx={{ fontWeight: 750 }}>{getAssetName(asset)}</TableCell>
                      <TableCell>{getAssetCode(asset)}</TableCell>
                      <TableCell>{asset.locationName || asset.location || "-"}</TableCell>
                      <TableCell>{asset.custodianName || asset.assignedTo || "-"}</TableCell>
                      <TableCell><Chip size="small" label={asset.verificationStatus || asset.status || "pending"} color={statusColor(asset.verificationStatus || asset.status)} /></TableCell>
                      <TableCell>{formatMoney(getBookValue(asset), asset.currency || "RWF")}</TableCell>
                      <TableCell align="center">
                        <IconButton color="primary" aria-label="View asset details" onClick={(event) => { event.stopPropagation(); setSelectedAsset(asset); }}>
                          <Visibility />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <EmptyState label="Assets" />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        )}
      </Paper>

      <AssetDetailsDialog
        asset={selectedAsset}
        related={selectedRelated}
        open={Boolean(selectedAsset)}
        onClose={() => setSelectedAsset(null)}
      />

      <Snackbar open={Boolean(error)} autoHideDuration={7000} onClose={() => setError("")} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert severity="error" onClose={() => setError("")}>{error}</Alert>
      </Snackbar>
    </Box>
  );
}
