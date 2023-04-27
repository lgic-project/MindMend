package org.example.beans;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

@AllArgsConstructor
@Data
public class ErrorResponse
{
    private String message;
    private HttpStatus status;
    private LocalDateTime timestamp;
}
