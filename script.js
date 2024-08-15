$(function () {
    var codeSorceElement = document.querySelector('#codeSorce')
    var codeTargetElement = document.querySelector('#codeTarget')
    var sorce = CodeMirror(codeSorceElement, {
      lineNumbers: true,
      mode: 'javascript',
      value: '',
      height: 500
      // theme: "duotone-light"
    })
    var target = CodeMirror(codeTargetElement, {
      lineNumbers: true,
      mode: 'XML/HTML',
      value: '',
      height: 500,
      // theme: "duotone-light",
      readOnly: true
    })
    // cm.setOption("theme", "duotone-light");
    // console.log(cm.getValue())

    function alertMessage(message){
        console.log("alertMessage",message);
        $(".overlay").addClass("show");
        $(".overlay .message-box").addClass("show");
        $(".overlay .message-box .message-body").html(message);
        $(".target-box").addClass("error");
        $(".target-box").removeClass("success");
    }
    function success(){
        $(".overlay").removeClass("show");
        $(".overlay .message-box").removeClass("show");
        $(".overlay .message-box .message-body").html("");
        $(".target-box").removeClass("error");
        $(".target-box").addClass("success");
    }
    

    $("#coptButton").on("click", function () {
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val(target.getValue()).select();
        document.execCommand("copy");
        $temp.remove();
        var icon2 = $(this).find(".icon2");
        var icon1 = $(this).find(".icon1");
        $("#copyButtonLabel").html("Copied");
        icon2.removeClass("hide");
        icon1.addClass("hide");
        setTimeout(function(){
            icon2.addClass("hide");
            icon1.removeClass("hide");
            $("#copyButtonLabel").html("Copy");
        },3000);
        
    });

    $("#moreInfo").on("click", function () {

      $('html').animate(
        {
          scrollTop: $('#howToUse').offset().top,
        },
        800 //speed
      );
      
    });

    $("#convertToXaml").on("click", function () {
      try {
        var codeInput = sorce.getValue();
        // $("#codeInput");
        var includeAppThemeColor = $("#includeAppThemeColor")[0].checked;
        if (codeInput === "") {
          alertMessage("Please paste the Material Design 3 JSON theme");
          return;
        }
        const json = JSON.parse(codeInput);
        var xaml =
          '<?xml version="1.0" encoding="UTF-8" ?>\n<?xaml-comp compile="true" ?>\n<ResourceDictionary \nxmlns="http://schemas.microsoft.com/dotnet/2021/maui" \nxmlns:x="http://schemas.microsoft.com/winfx/2009/xaml" \nxmlns:toolkit="http://schemas.microsoft.com/dotnet/2022/maui/toolkit">\n';

        // Convert the color palettes
        for (var palette in json.palettes) {
          var newPalette = palette[0].toUpperCase() + palette.slice(1);
          xaml += "    <!-- " + newPalette + " -->\n";
          for (var color in json.palettes[palette]) {
            xaml +=
              '    <Color x:Key="' +
              newPalette.replace(/-/g, "").replace("variant", "Variant") +
              color +
              '">' +
              json.palettes[palette][color] +
              "</Color>\n";
          }
        }

        if (!includeAppThemeColor) {
          // Convert the app theme colors
          for (var scheme in json.schemes) {
            var newScheme = scheme[0].toUpperCase() + scheme.slice(1);
            newScheme = newScheme
              .replace("contrast", "Contrast")
              .replace("high", "High")
              .replace("medium", "Medium");
            xaml += "    <!-- " + newScheme + " -->\n";
            for (var type in json.schemes[scheme]) {
              var area = type[0].toUpperCase() + type.slice(1);
              xaml +=
                '   <Color x:Key="' +
                newScheme.replace(/-/g, "") +
                area +
                '">' +
                json.schemes[scheme][type] +
                "</Color>\n";
            }
          }
        }

        if (includeAppThemeColor) {
          xaml +=
            "    <!-- AppThemeColor from .NET MAUI Community Toolkit -->\n";
          for (var scheme in json.schemes) {
            console.log(scheme);
            if (scheme.includes("light")) {
              var newScheme = scheme[0].toUpperCase() + scheme.slice(1);
              newScheme = newScheme
                .replace("contrast", "Contrast")
                .replace("high", "High")
                .replace("medium", "Medium");
              for (var type in json.schemes[scheme]) {
                var area = type[0].toUpperCase() + type.slice(1);
                var darkScheme =
                  json.schemes[scheme.replace("light", "dark")];
                console.log(type);
                console.log(darkScheme);
                xaml +=
                  '   <toolkit:AppThemeColor x:Key="' +
                  newScheme
                    .replace(/-/g, "")
                    .replace("Light", "")
                    .replace("Dark", "") +
                  area +
                  '" Light="' +
                  json.schemes[scheme][type] +
                  '" Dark="' +
                  darkScheme[type] +
                  '" />\n   ';
              }
            }
          }
        }
        xaml += "</ResourceDictionary>";

        // $("#codeResult").text(xaml);
        target.setValue(xaml);
        success();

        hljs.highlightAll();
      } catch (error) {
        alertMessage(error);
      }
    });
  });