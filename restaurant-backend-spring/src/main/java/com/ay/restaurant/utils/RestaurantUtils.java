package com.ay.restaurant.utils;

import com.google.common.base.Strings;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import org.json.JSONArray;
import org.json.JSONException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/* Static methods accessible directly by the class name */
public class RestaurantUtils {

    private RestaurantUtils() { }

    public static ResponseEntity<String> getResponseEntity(String responseMessage, HttpStatus httpStatus) {
        return new ResponseEntity<String>("{\"message\":\"" + responseMessage + "\"}", httpStatus);
    }

    public static ResponseEntity<Object> getResponseEntityObject(Map<String, Object> responseBody, String message, HttpStatus httpStatus) {
        responseBody.put("message", message);
        return ResponseEntity.status(httpStatus).body(responseBody);
    }

    /* Generates a unique identifier (UUID) based on the current time to ensure each bill has a distinct identifier */
    public static String getUUID() {
        Date date = new Date();
        long time = date.getTime();
        return "Bill-" + time;
    }

    /* Converts a JSON formatted string into a JSONArray object */
    public static JSONArray getJsonArrayFromString(String data) throws JSONException {
        JSONArray jsonArray = new JSONArray(data);
        return jsonArray;
    }

    /*  Converts a JSON formatted string into a Map<String,Object> object. It uses the Gson library to deserialize the JSON string into a Map object.
     * This is helpful when dealing with JSON data that needs to be accessed and manipulated as key-value pairs.
     * If the input string is empty or null, it returns an empty HashMap */
    public static Map<String,Object> getMapFromJson(String data) {
        if(!Strings.isNullOrEmpty(data))
            return new Gson().fromJson(data, new TypeToken<Map<String,Object>>(){}.getType());
        return new HashMap<>();
    }

}
