import 'bootstrap';
import './scss/app.scss';

window.application = null;

$(document).ready(function() {
    let url = new URL(window.location.href);
    
    let appId = url.searchParams.get('i');
    if (appId != null && appId == 1) {
        // $('#AppName').text('App: Tactility');
    }
    
    let architecture = url.searchParams.get('a');
    if (architecture != null) {
        // $('#Architecture').text('Architecture: ' + architecture);
    }
    
    let version = url.searchParams.get('v');
    if (version != null) {
        // $('#Version').text('Version: ' + version);
    }
    
    let stacktrace = url.searchParams.get('s');
    let parts_modulus = stacktrace.length % 16
    if (parts_modulus == 0) {
        let part_count = stacktrace.length / 16;
        for (var i = 0; i < part_count; i++) {
            let pc = stacktrace.substring(i * 16, i * 16 + 8);
            let sp = stacktrace.substring(i * 16 + 8, i * 16 + 16);
            $('#Stacktrace').after(pc + ":" + sp + " ");
        }
    } else {
        console.error("Wrong input");
    }
});
