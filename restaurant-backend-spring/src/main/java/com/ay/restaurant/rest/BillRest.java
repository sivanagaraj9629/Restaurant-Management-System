package com.ay.restaurant.rest;

import com.ay.restaurant.pojo.Bill;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RequestMapping(path = "/bills")
public interface BillRest {

    @PostMapping(path = "/report")
    public ResponseEntity<String> generateReport(@RequestBody(required = true) Map<String,Object> requestMap);

    @GetMapping(path = "/all")
    public ResponseEntity<List<Bill>> getBills();

    @PostMapping(path = "/pdf")
    public ResponseEntity<byte[]> getPdf(@RequestBody(required = true) Map<String,Object> requestMap);

    @GetMapping(path = "/delete/{id}")
    public ResponseEntity<String> deleteBill(@PathVariable Integer id);

}
