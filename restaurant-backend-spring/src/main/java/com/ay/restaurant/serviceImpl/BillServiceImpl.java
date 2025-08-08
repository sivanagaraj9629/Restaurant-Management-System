package com.ay.restaurant.serviceImpl;

import com.ay.restaurant.constants.RestaurantConstants;
import com.ay.restaurant.dao.BillDao;
import com.ay.restaurant.jwt.JwtFilter;
import com.ay.restaurant.pojo.Bill;
import com.ay.restaurant.service.BillService;
import com.ay.restaurant.utils.RestaurantUtils;
import com.google.common.base.Strings;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.Date;

import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Stream;

@Slf4j
@Service
@RequiredArgsConstructor
public class BillServiceImpl implements BillService {

    private final BillDao billDao;
    private final JwtFilter jwtFilter;
    private Date billDate = new Date();

    /* Generates a PDF report based on the provided request map containing bill details.
     * This method validates the request map, generates a file name, creates a PDF document, adds content to the document and saves the document to both file system and database */
    @Override
    public ResponseEntity<String> generateReport(Map<String,Object> requestMap) {
        log.info("Inside generateReport");
        try {
            if(validateRequestMap(requestMap)) {
                String fileName = RestaurantUtils.getUUID();
                requestMap.put("uuid", fileName);
                if(!Strings.isNullOrEmpty(fileName)) {
                    Document document = new Document();
                    ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
                    /* An instance of PdfWriter is associated with a PDF document. It specifies the output stream where the PDF content will be written (it initializes the PDF writing process to the specified file location) */
                    PdfWriter.getInstance(document, byteArrayOutputStream);
                    document.open();
                    addContentToDocument(document, requestMap);
                    document.close();
                    // Save the pdf file to the file system
                    savePdfToFileSystem(byteArrayOutputStream, fileName);
                    saveBill(requestMap, byteArrayOutputStream.toByteArray());
                    return new ResponseEntity<>("{\"uuid\":\"" + fileName + "\"}", HttpStatus.OK);
                }
            }
            else
                return RestaurantUtils.getResponseEntity("Required data not found", HttpStatus.BAD_REQUEST);
        } catch(Exception exception) {
            exception.printStackTrace();
        }
        return RestaurantUtils.getResponseEntity(RestaurantConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private boolean validateRequestMap(Map<String,Object> requestMap) {
        return requestMap.containsKey("name") && requestMap.containsKey("contactNumber")
                && requestMap.containsKey("email") && requestMap.containsKey("paymentMethod")
                && requestMap.containsKey("itemDetails") && requestMap.containsKey("totalAmount");
    }

    private void addContentToDocument(Document document, Map<String, Object> requestMap) throws Exception {
        String data = prepareData(requestMap);
        Paragraph header = new Paragraph("Restaurant Management System", getFont("Header"));
        header.setAlignment(Element.ALIGN_CENTER);
        document.add(header);
        Paragraph paragraph = new Paragraph("\n" + data + "\n \n", getFont("Data"));
        document.add(paragraph);
        PdfPTable table = createTable();
        addTableHeader(table);
        JSONArray jsonArray = RestaurantUtils.getJsonArrayFromString((String) requestMap.get("itemDetails"));
        for(int i=0; i<jsonArray.length(); i++) {
            addRows(table, RestaurantUtils.getMapFromJson(jsonArray.getString(i)));
        }
        document.add(table);
        Paragraph footer = new Paragraph("\nTotal: " + requestMap.get("totalAmount") + "\nThank you for visiting!");
        document.add(footer);
    }

    private String prepareData(Map<String, Object> requestMap) throws ParseException {
        SimpleDateFormat outputDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String formattedDateString = outputDateFormat.format(this.billDate);

        return "Name: " + requestMap.get("name") + "\n" +
                "Contact number: " + requestMap.get("contactNumber") + "\n" +
                "Email: " + requestMap.get("email") + "\n" +
                "Payment method: " + requestMap.get("paymentMethod") + "\n" +
                "Issue Date: " + formattedDateString;
    }

    private Date setDateFormat(String stringIssueDate) throws ParseException {
        SimpleDateFormat inputDateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        return inputDateFormat.parse(stringIssueDate);
    }

    /* Retrieves the appropriate font based on the specified type */
    private Font getFont(String type) {
        log.info("Inside getFont");
        switch(type) {
            case "Header":
                Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLDOBLIQUE, 16, BaseColor.BLACK);
                headerFont.setStyle(Font.BOLD);
                return headerFont;
            case "Data":
                return FontFactory.getFont(FontFactory.TIMES_ROMAN, 11, BaseColor.BLACK);
            default:
                return new Font();
        }
    }

    /* Creates a PDF table for displaying item details */
    private PdfPTable createTable() {
        PdfPTable table = new PdfPTable(5);
        table.setWidthPercentage(100);
        return table;
    }

    private void addTableHeader(PdfPTable table) {
        log.info("Inside addTableHeader");
        Stream.of("Name", "Category", "Quantity", "Price", "Sub Total")
                .forEach(columnTitle -> {
                    PdfPCell tableHeader = new PdfPCell();
                    tableHeader.setPhrase(new Phrase(columnTitle));
                    tableHeader.setHorizontalAlignment(Element.ALIGN_CENTER);
                    tableHeader.setVerticalAlignment(Element.ALIGN_CENTER);
                    tableHeader.setBorderWidth(1f); // Adjust the width as needed
                    table.addCell(tableHeader);
                });
    }

    /* Saves the bill details to the database */
    private void saveBill(Map<String,Object> requestMap, byte[] pdfData) {
        try {
            Bill bill = new Bill();
            this.billDate = java.sql.Timestamp.valueOf(LocalDateTime.now());
            bill.setUuid((String) requestMap.get("uuid"));
            bill.setName((String) requestMap.get("name"));
            bill.setEmail((String) requestMap.get("email"));
            bill.setContactNumber((String) requestMap.get("contactNumber"));
            bill.setIssueDate(this.billDate);
            bill.setPaymentMethod((String) requestMap.get("paymentMethod"));
            bill.setTotal(Double.parseDouble((String) requestMap.get("totalAmount")));
            //bill.setTotal(Double.parseDouble(String.format("%.2f", Double.parseDouble((String) requestMap.get("totalAmount")))));
            //bill.setTotal(Math.round(Double.parseDouble((String) requestMap.get("totalAmount")) * 100.0) / 100.0);
            bill.setItemDetails((String) requestMap.get("itemDetails"));
            bill.setCreatedBy(jwtFilter.getCurrentUser());
            bill.setPdf(pdfData);
            billDao.save(bill);
        } catch(Exception exception) {
            exception.printStackTrace();
        }
    }

    /* Adds rows to the PDF table based on the provided data */
    private void addRows(PdfPTable table, Map<String,Object> data) {
        log.info("Inside addRows");
        table.addCell((String) data.get("name"));
        table.addCell((String) data.get("category"));
        table.addCell(Integer.toString(((Double) data.get("quantity")).intValue()));
        table.addCell(Double.toString((Double) data.get("price")));
        table.addCell(Double.toString((Double) data.get("total")));
    }

    private void savePdfToFileSystem(ByteArrayOutputStream byteArrayOutputStream, String fileName) throws IOException {
        try (FileOutputStream fileOutputStream = new FileOutputStream(RestaurantConstants.STORE_LOCATION + fileName + ".pdf")) {
            byteArrayOutputStream.writeTo(fileOutputStream);
        }
    }

    @Override
    public ResponseEntity<List<Bill>> getBills() {
        log.info("Inside getBills");
        try {
            List<Bill> bills;
            if(jwtFilter.isAdmin())
                bills = billDao.findAllBills();
            else
                bills = billDao.findBillByUsername(jwtFilter.getCurrentUser());
            return new ResponseEntity<>(bills, HttpStatus.OK);
        } catch(Exception exception) {
            exception.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<byte[]> getPdf(Map<String,Object> requestMap) {
        log.info("Inside getPdf");
        try {
            if(!requestMap.containsKey("uuid"))
                return new ResponseEntity<>(null, HttpStatus.BAD_GATEWAY);
            String uuid = (String) requestMap.get("uuid");
            Bill bill = billDao.findByUuid(uuid);
            if(bill != null && bill.getPdf() != null) {
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_PDF);
                headers.setContentDispositionFormData("filename", uuid + ".pdf");
                headers.setContentLength(bill.getPdf().length);
                return new ResponseEntity<>(bill.getPdf(), headers, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
        } catch(Exception exception) {
            exception.printStackTrace();
        }
        return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> deleteBill(Integer id) {
        try {
            if(jwtFilter.isAdmin()) {
                Optional<Bill> optionalBill = billDao.findById(id);
                if(!optionalBill.isEmpty()) {
                    billDao.delete(optionalBill.get());
                    return RestaurantUtils.getResponseEntity("Bill deleted successfully", HttpStatus.OK);
                }
                else
                    return RestaurantUtils.getResponseEntity("Bill id does not exist", HttpStatus.OK);
            }
            else
                return RestaurantUtils.getResponseEntity(RestaurantConstants.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED);
        } catch(Exception exception) {
            exception.printStackTrace();
        }
        return RestaurantUtils.getResponseEntity(RestaurantConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}