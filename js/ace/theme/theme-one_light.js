ace.define("ace/theme/one_light",["require","exports","module","ace/lib/dom"], function(require, exports, module) {

    exports.islight = true;
    exports.cssClass = "ace-one-light";
    exports.cssText = ".ace-one-light .ace_gutter {\
background: white;\
color: #6a6f7a\
}\
.ace-one-light .ace_print-margin {\
width: 1px;\
background: transparent\
}\
.ace-one-light {\
background-color: white;\
color: black\
}\
.ace-one-light .ace_cursor {\
color: #528bff\
}\
.ace-one-light .ace_marker-layer .ace_selection {\
background: #d0d4db\
}\
.ace-one-light.ace_multiselect .ace_selection.ace_start {\
box-shadow: 0 0 3px 0 #282c34;\
border-radius: 2px\
}\
.ace-one-light .ace_marker-layer .ace_step {\
background: #77db04\
}\
.ace-one-light .ace_marker-layer .ace_bracket {\
margin: -1px 0 0 -1px;\
border: 1px solid #747369\
}\
.ace-one-light .ace_marker-layer .ace_active-line {\
background: rgba(76, 87, 103, .19)\
}\
.ace-one-light .ace_gutter-active-line {\
background-color: rgba(76, 87, 103, .19)\
}\
.ace-one-light .ace_marker-layer .ace_selected-word {\
border: 1px solid #d0d4db\
}\
.ace-one-light .ace_fold {\
background-color: #0580e6;\
border-color: #abb2bf\
}\
.ace-one-light .ace_keyword {\
color: #e62736\
}\
.ace-one-light .ace_keyword.ace_operator {\
color: #00c4be\
}\
.ace-one-light .ace_keyword.ace_other.ace_unit {\
color: #d67315\
}\
.ace-one-light .ace_constant.ace_language {\
color: #d67315\
}\
.ace-one-light .ace_constant.ace_numeric {\
color: #d67315\
}\
.ace-one-light .ace_constant.ace_character {\
color: #04b4c9\
}\
.ace-one-light .ace_constant.ace_other {\
color: #04b4c9\
}\
.ace-one-light .ace_support.ace_function {\
color: #0580e6\
}\
.ace-one-light .ace_support.ace_constant {\
color: #d67315\
}\
.ace-one-light .ace_support.ace_class {\
color: #e39a12\
}\
.ace-one-light .ace_support.ace_type {\
color: #e39a12\
}\
.ace-one-light .ace_storage {\
color: #af10de\
}\
.ace-one-light .ace_storage.ace_type {\
color: #af10de\
}\
.ace-one-light .ace_invalid {\
color: #fff;\
background-color: #f2777a\
}\
.ace-one-light .ace_invalid.ace_deprecated {\
color: #272b33;\
background-color: #d27b53\
}\
.ace-one-light .ace_string {\
color: #45a600\
}\
.ace-one-light .ace_string.ace_regexp {\
color: #e62736\
}\
.ace-one-light .ace_comment {\
font-style: italic;\
color: #949fb3\
}\
.ace-one-light .ace_variable {\
color: #e62736\
}\
.ace-one-light .ace_variable.ace_parameter {\
color: #d67315\
}\
.ace-one-light .ace_meta.ace_tag {\
color: #e62736\
}\
.ace-one-light .ace_entity.ace_other.ace_attribute-name {\
color: #e62736\
}\
.ace-one-light .ace_entity.ace_name.ace_function {\
color: #0580e6\
}\
.ace-one-light .ace_entity.ace_name.ace_tag {\
color: #e62736\
}\
.ace-one-light .ace_markup.ace_heading {\
color: #45a600\
}\
.ace-one-light .ace_indent-guide {\
background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWPQ09NrYAgMjP4PAAtGAwchHMyAAAAAAElFTkSuQmCC) right repeat-y\
}\
";
    
    var dom = require("../lib/dom");
    dom.importCssString(exports.cssText, exports.cssClass, false);
    });                (function() {
                    ace.require(["ace/theme/one_light"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            