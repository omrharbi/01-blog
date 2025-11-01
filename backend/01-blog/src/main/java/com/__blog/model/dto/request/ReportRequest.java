package com.__blog.model.dto.request;

import java.util.UUID;

import com.__blog.model.enums.ReportReason;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ReportRequest {

    // private UUID reporterId;// the user who created the report
    private ReportReason reasons;
    private UUID postReportId;
    private UUID commentReportId;
}
