import 'bootstrap';
import './scss/app.scss';

window.application = null;

class Report {
    constructor(appName, architecture, version, stacktrace) {
        this.appName = appName;
        this.architecture = architecture;
        this.version = version;
        this.stacktrace = stacktrace;
    }
}

function getAppName(id) {
    if (id == 1) {
        return 'Tactility';
    } else {
        return 'unknown'
    }
}

function decodeStackTrace(encodedStacktrace) {
    let stacktrace_text = '';
    let parts_modulus = encodedStacktrace.length % 8
    if (parts_modulus == 0) {
        let part_count = encodedStacktrace.length / 8;
        for (var i = 0; i < part_count; i++) {
            let pc = encodedStacktrace.substring(i * 8, i * 8 + 8);
            stacktrace_text += pc + ' '
        }
    } else {
        console.error("Wrong input");
    }
    return stacktrace_text;
}

function getReportAsText(report) {
    return 'Application: ' + report.appName + '\n' + 
        'Version: ' + report.version + '\n' +
        'Architecture: ' + report.architecture + '\n' +
        'Stacktrace: ' + report.stacktrace;
}

$(document).ready(function() {
    let url = new URL(window.location.href);
    
    let appId = url.searchParams.get('i');
    let appName = getAppName(appId);
    
    let architecture = url.searchParams.get('a');
    if (architecture == null) {
        architecture = 'unknown';
    }
    
    let version = url.searchParams.get('v');
    if (version == null) {
        version = 'unknown';        
    }
    
    let stacktrace_input = url.searchParams.get('s');
    let stacktrace_text;
    if (stacktrace_input != null) {
        stacktrace_text = decodeStackTrace(stacktrace_input);
    } else {
        stacktrace_text = '';
    }
    
    let report = new Report(
        appName,
        architecture,
        version,
        stacktrace_text
    )

    let report_text = getReportAsText(report);
    let report_html = report_text.replaceAll('\n', '<br/>');
    $('#Report').html(report_html);
    
    let m_part = 'welder.';
    let m_at = '@';
    let m_subject = 'Crash report for ' + appName;
    let m_body = report_text.replaceAll('\n', '%0D%0A');
    $('#Share').click(function(){
        location.href='m' + 'ailto:' + 'mail' + m_at + 'byte' + m_part + 'com' + '?subject=' + m_subject + '&body=' + m_body; 
    });
});
