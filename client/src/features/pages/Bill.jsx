"use client"

import { useState, useRef, useCallback } from "react"
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
  Snackbar,
  Alert,
  Divider,
} from "@mui/material"
import { Print, PictureAsPdf, BusinessCenter, Person, Phone, Email, LocationOn } from "@mui/icons-material"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
const Bill = () => {
      const printRef = useRef(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")

  const [receiptData, setReceiptData] = useState({
    receiptNumber: "MA-061125",
    date: "06/11/2025",
    customerName: "Jennifer Wilson",
    customerPhone: "+1 347 865 8980",
    customerAddress: "200 Bethel Loop, Brooklyn, Starrett City apt 13A, Brooklyn, New York, United States - 11239",
    customerEmail: "jwilson0106@outlook.com",
    serviceName: "Manual Lymphatic Drainage Post op Package of 4",
    quantity: 1,
    unitPrice: 565.0,
    total: 565.0,
    paymentMethod: "Paid cash",
    signature: "",
  })

  const handlePrint = useCallback(() => {
    if (printRef.current) {
      const printContent = printRef.current.innerHTML
      const originalContent = document.body.innerHTML
      document.body.innerHTML = printContent
      window.print()
      document.body.innerHTML = originalContent
      window.location.reload()
    }
  }, [])

  const handleGeneratePDF = useCallback(async () => {
    if (!printRef.current) {
      setSnackbarMessage("Receipt content not found")
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
      return
    }

    try {
      setSnackbarMessage("Generating PDF...")
      setSnackbarSeverity("info")
      setSnackbarOpen(true)

      const receiptElement = printRef.current
      const canvas = await html2canvas(receiptElement, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      })

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)

      const fileName = `Receipt_${receiptData.receiptNumber}_${receiptData.date.replace(/\//g, "-")}.pdf`
      pdf.save(fileName)

      setSnackbarMessage("PDF generated successfully!")
      setSnackbarSeverity("success")
      setSnackbarOpen(true)
    } catch (error) {
      console.error("Error generating PDF:", error)
      setSnackbarMessage("Error generating PDF. Please try again.")
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
    }
  }, [receiptData.receiptNumber, receiptData.date])

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false)
  }
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", p: { xs: 2, md: 3, lg: 4 } }}>
      <Box sx={{ maxWidth: "1200px", mx: "auto" }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { sm: "center" },
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: "600", color: "#333", mb: 0.5 }}>
                Medical Spa Receipt Generator
              </Typography>
              <Typography variant="h6" sx={{ color: "#666", fontWeight: "400" }}>
                Create professional medical spa receipts
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Button
                variant="outlined"
                startIcon={<Print />}
                onClick={handlePrint}
                sx={{
                  borderColor: "#ff5722",
                  color: "#ff5722",
                  "&:hover": { borderColor: "#e64a19", bgcolor: "#fff3e0" },
                  textTransform: "none",
                  borderRadius: 2,
                }}
              >
                Print
              </Button>
              <Button
                variant="contained"
                startIcon={<PictureAsPdf />}
                onClick={handleGeneratePDF}
                sx={{
                  bgcolor: "#ff5722",
                  "&:hover": { bgcolor: "#e64a19" },
                  textTransform: "none",
                  borderRadius: 2,
                  boxShadow: "0 4px 12px rgba(255, 87, 34, 0.3)",
                }}
              >
                Generate PDF
              </Button>
            </Box>
          </Box>
        </Box>

        <Grid container spacing={4}>
          {/* Left Side - Form */}
          <Grid item xs={12} lg={5}>
            <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ mb: 3, color: "#333", fontWeight: "600" }}>
                  Receipt Information
                </Typography>

                {/* Receipt Details */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Receipt Number"
                      value={receiptData.receiptNumber}
                      onChange={(e) => setReceiptData({ ...receiptData, receiptNumber: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Date"
                      value={receiptData.date}
                      onChange={(e) => setReceiptData({ ...receiptData, date: e.target.value })}
                      placeholder="MM/DD/YYYY"
                    />
                  </Grid>
                </Grid>

                {/* Customer Information */}
                <Typography variant="subtitle1" sx={{ mb: 2, color: "#333", fontWeight: "600" }}>
                  Customer Information
                </Typography>
                <Grid container spacing={2} sx={{ mb: 4 }}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Customer Name"
                      value={receiptData.customerName}
                      onChange={(e) => setReceiptData({ ...receiptData, customerName: e.target.value })}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person sx={{ color: "#ff5722" }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Phone"
                      value={receiptData.customerPhone}
                      onChange={(e) => setReceiptData({ ...receiptData, customerPhone: e.target.value })}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone sx={{ color: "#ff5722" }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      multiline
                      rows={2}
                      value={receiptData.customerAddress}
                      onChange={(e) => setReceiptData({ ...receiptData, customerAddress: e.target.value })}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationOn sx={{ color: "#ff5722" }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={receiptData.customerEmail}
                      onChange={(e) => setReceiptData({ ...receiptData, customerEmail: e.target.value })}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email sx={{ color: "#ff5722" }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>

                {/* Service Information */}
                <Typography variant="subtitle1" sx={{ mb: 2, color: "#333", fontWeight: "600" }}>
                  Service Information
                </Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Service Name"
                      value={receiptData.serviceName}
                      onChange={(e) => setReceiptData({ ...receiptData, serviceName: e.target.value })}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <BusinessCenter sx={{ color: "#ff5722" }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Quantity"
                      type="number"
                      value={receiptData.quantity}
                      onChange={(e) => {
                        const qty = Number.parseInt(e.target.value) || 1
                        setReceiptData({
                          ...receiptData,
                          quantity: qty,
                          total: qty * receiptData.unitPrice,
                        })
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Unit Price"
                      type="number"
                      value={receiptData.unitPrice}
                      onChange={(e) => {
                        const price = Number.parseFloat(e.target.value) || 0
                        setReceiptData({
                          ...receiptData,
                          unitPrice: price,
                          total: receiptData.quantity * price,
                        })
                      }}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Payment Method"
                      value={receiptData.paymentMethod}
                      onChange={(e) => setReceiptData({ ...receiptData, paymentMethod: e.target.value })}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Side - Receipt Preview */}
          <Grid item xs={12} lg={7}>
            <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
              <CardContent sx={{ p: 0 }}>
                <div ref={printRef}>
                  <Paper
                    sx={{
                      bgcolor: "white",
                      minHeight: "800px",
                      "@media print": {
                        boxShadow: "none",
                        borderRadius: 0,
                      },
                    }}
                  >
                    {/* Orange Header Stripe */}
                    <Box sx={{ bgcolor: "#ff5722", height: "12px", width: "100%" }} />

                    {/* Header Section */}
                    <Box sx={{ p: 4, pb: 2 }}>
                      <Grid container spacing={3}>
                        <Grid item xs={8}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                            {/* Heart Logo */}
                            <Box
                              sx={{
                                width: 60,
                                height: 60,
                                bgcolor: "#ffd700",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              <Typography sx={{ fontSize: "24px", color: "#fff" }}>♥</Typography>
                            </Box>
                            <Box>
                              <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333", mb: 0.5 }}>
                                Magic Journey Sanctuary LLC
                              </Typography>
                              <Typography variant="body2" sx={{ color: "#666", fontSize: "12px" }}>
                                2708 Glenwood Rd, Brooklyn, NY 11210
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" sx={{ color: "#666", fontSize: "12px" }}>
                              <strong>Phone:</strong> +1 (929) 258-8852
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#666", fontSize: "12px" }}>
                              <strong>Email:</strong> info@lymphaticmassagedrainage.com
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={4} sx={{ textAlign: "right" }}>
                          <Typography variant="h4" sx={{ fontWeight: "300", color: "#999", mb: 2 }}>
                            RECEIPT
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#333", mb: 1 }}>
                            <strong>DATE:</strong> {receiptData.date}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#333" }}>
                            <strong>RECEIPT NO:</strong> {receiptData.receiptNumber}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>

                    {/* Bill To Section */}
                    <Box sx={{ px: 4, py: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333", mb: 2 }}>
                        BILL TO
                      </Typography>
                      <Box sx={{ ml: 2 }}>
                        <Typography variant="body2" sx={{ color: "#333", mb: 0.5 }}>
                          <strong>Name:</strong> {receiptData.customerName}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#333", mb: 0.5 }}>
                          <strong>Phone:</strong> {receiptData.customerPhone}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#333", mb: 0.5 }}>
                          <strong>Address:</strong> {receiptData.customerAddress}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#333" }}>
                          <strong>Email:</strong> {receiptData.customerEmail}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Service Table */}
                    <Box sx={{ px: 4, py: 2 }}>
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow sx={{ bgcolor: "#ff5722" }}>
                              <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "14px" }}>
                                DESCRIPTION
                              </TableCell>
                              <TableCell
                                sx={{ color: "white", fontWeight: "bold", fontSize: "14px", textAlign: "center" }}
                              >
                                QTY
                              </TableCell>
                              <TableCell
                                sx={{ color: "white", fontWeight: "bold", fontSize: "14px", textAlign: "center" }}
                              >
                                UNIT PRICE
                              </TableCell>
                              <TableCell
                                sx={{ color: "white", fontWeight: "bold", fontSize: "14px", textAlign: "right" }}
                              >
                                TOTAL
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell sx={{ fontSize: "14px", py: 2 }}>{receiptData.serviceName}</TableCell>
                              <TableCell sx={{ fontSize: "14px", py: 2, textAlign: "center" }}>
                                {receiptData.quantity}
                              </TableCell>
                              <TableCell sx={{ fontSize: "14px", py: 2, textAlign: "center" }}>
                                {receiptData.unitPrice.toFixed(2)}
                              </TableCell>
                              <TableCell sx={{ fontSize: "14px", py: 2, textAlign: "right" }}>
                                {receiptData.total.toFixed(2)}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>

                      <Box sx={{ textAlign: "center", mt: 2 }}>
                        <Typography variant="body2" sx={{ fontStyle: "italic", color: "#666" }}>
                          {receiptData.paymentMethod}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Total Section */}
                    <Box sx={{ px: 4, py: 2, mt: 4 }}>
                      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                        <Box sx={{ minWidth: "200px" }}>
                          <Typography variant="body1" sx={{ textAlign: "right", mb: 1 }}>
                            <strong>TOTAL INCLUDING TAX: ${receiptData.total.toFixed(2)}</strong>
                          </Typography>
                          <Divider sx={{ mb: 1 }} />
                          <Box sx={{ bgcolor: "#f5f5f5", p: 2, borderRadius: 1 }}>
                            <Typography variant="h6" sx={{ textAlign: "right", fontWeight: "bold" }}>
                              Balance Paid: ${receiptData.total.toFixed(2)}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>

                    {/* Signature Section */}
                    <Box sx={{ px: 4, py: 4, mt: 4 }}>
                      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333", mb: 2 }}>
                        Payment Consent Signature
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#666", mb: 3, fontStyle: "italic" }}>
                        By signing below, I confirm that I have made this payment willingly.
                      </Typography>

                      <Box sx={{ mt: 3 }}>
                        <Typography variant="body2" sx={{ color: "#333", mb: 1 }}>
                          <strong>Client Signature:</strong>
                        </Typography>
                        <Box
                          sx={{
                            width: "250px",
                            height: "60px",
                            border: "1px solid #ddd",
                            bgcolor: "#f8f9fa",
                            borderRadius: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography variant="body2" sx={{ color: "#999", fontSize: "24px" }}>
                            ✓
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Orange Footer Stripe */}
                    <Box sx={{ bgcolor: "#ff5722", height: "12px", width: "100%", mt: 4 }} />
                  </Paper>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Bill