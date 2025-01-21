import 'bootstrap';
import './scss/app.scss';

window.application = null;

import toolbarLogo from './asset/images/toolbar-logo.svg';
import shareImage from './asset/images/share.svg';
import terminalImage from './asset/images/terminal.svg';
import './asset/images/favicon.svg';

NavbarImage.src = toolbarLogo;
ShareImage.src = shareImage;
TerminalImage.src = terminalImage;

class Report {
    constructor(architecture, version, board, stacktrace) {
        this.architecture = architecture;
        this.version = version;
        this.board = board;
        this.stacktrace = stacktrace;
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
    return 'Version: ' + report.version + '\n' +
        'Architecture: ' + report.architecture + '\n' +
        'Board: ' + report.board + '\n' +
        'Stacktrace: ' + report.stacktrace;
}

function showReport(architecture, version, board, stacktrace) {
    let stacktrace_text = decodeStackTrace(stacktrace);
    let report = new Report(
        architecture,
        version,
        board,
        stacktrace_text
    )

    let report_text = getReportAsText(report);
    
    let commandline = "xtensa-" + architecture + "-elf-addr2line -pfiaC -e build/Tactility.elf " + stacktrace_text;
    $('#Commandline').html(commandline);
    
    let m_part = 'welder.';
    let m_at = '@';
    let m_subject = 'Crash report for Tactility';
    let m_body = report_text.replaceAll('\n', '%0D%0A');
    $('#Share').click(function(){
        location.href='m' + 'ailto:' + 'mail' + m_at + 'byte' + m_part + 'com' + '?subject=' + m_subject + '&body=' + m_body; 
    });

    $('#MainHeader').removeClass('invisible');
    $('#MainShare').removeClass('invisible');
    
    $('#MainFallback').remove();
}

function showNoReport() {
    $('#MainFallback').removeClass('invisible');
    
    $('#MainHeader').remove();
    $('#MainShare').remove();
}

$(document).ready(function() {
    let url = new URL(window.location.href);
    
    let architecture = url.searchParams.get('a');
    let version = url.searchParams.get('v');
    let board = url.searchParams.get('b');
    let stacktrace = url.searchParams.get('s');
    
    if (architecture != null && version != null && stacktrace != null) {
        showReport(architecture, version, board, stacktrace);
    } else {
        showNoReport();
    }
});
