$(document).ready(function(){
    $("#stop").mouseover(function(){
        $("#pic-stop").css("display ","none");
        $("#stop-sel").css("display "," block");
    });
    $("#stop").mouseout(function(){
        $("#stop-sel").css("display ","none");
        $("#pic-stop").css("display "," block");
    });
});