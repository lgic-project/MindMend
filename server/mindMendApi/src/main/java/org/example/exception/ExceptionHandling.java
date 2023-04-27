package org.example.exception;

import org.example.beans.ErrorListResponse;
import org.example.beans.ErrorResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ControllerAdvice
public class ExceptionHandling extends ResponseEntityExceptionHandler {
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<Object> handleUserNotFound(NotFoundException ex , WebRequest request) {

        return new ResponseEntity<>(new ErrorResponse(ex.getMessage(), HttpStatus.NOT_FOUND, LocalDateTime.now()),HttpStatus.NOT_FOUND);

    }

//    @Override
//    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatus status, WebRequest request) {
//        List<String> details = new ArrayList<>();
//        for(ObjectError error : ex.getBindingResult().getAllErrors()) {
//            details.add(error.getDefaultMessage());
//        }
//        return new ResponseEntity(new ErrorListResponse(details,HttpStatus.BAD_REQUEST,LocalDateTime.now()), HttpStatus.BAD_REQUEST);
//    }


    @ExceptionHandler(NoMatchException.class)
    public ResponseEntity<Object> handleNoMatchException(NoMatchException nm , WebRequest request) {

        return new ResponseEntity<>(new ErrorResponse(nm.getMessage(),HttpStatus.NOT_FOUND, LocalDateTime.now()),HttpStatus.NOT_FOUND);


    }

    @ExceptionHandler(UserAlreadyExistException.class)
    public ResponseEntity<Object> handleUserAlreadyExist(NotFoundException ex , WebRequest request) {

        return new ResponseEntity<>(new ErrorResponse(ex.getMessage(), HttpStatus.NOT_FOUND, LocalDateTime.now()),HttpStatus.ALREADY_REPORTED);

    }



}
