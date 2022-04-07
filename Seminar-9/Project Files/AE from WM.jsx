//-------------------------------------------------------------------------------------------------------------------------------------
//      Course web page:      mipt.ru/education/chair/theoretical_mechanics/courses/haos-i-kotiki.php   
//      Course chat:                t.me/miptdesign                                                                                                                     
//      Scripts reposirory:      github.com/Eltaurus-Lt/CnC/tree/main/Scripts
//      e-mail:                          efimov.ss@phystech.edu
//____________________________________________________________________________

var prop;

//dialog window
var Wind=new Window("palette","Choose property",undefined); 
Wind.orientation="column";
var props=Wind.add("dropdownlist",undefined,["Selected Effect","Position","Scale","Orientation"]); // sep pos & rotation
props.selection=0;
var ok=Wind.add("button",undefined,"Select WM file"); //button

//select file dialog
ok.onClick = function eventt()
{
    if (props.selection==0)  
    {prop=app.project.activeItem.selectedLayers[0].selectedProperties[1];}
    else if (props.selection==1)  
    {prop=app.project.activeItem.selectedLayers[0].property("ADBE Transform Group").property("ADBE Position");}
    else if (props.selection==2)  
    {prop=app.project.activeItem.selectedLayers[0].property("ADBE Transform Group").property("ADBE Scale");}
    else 
    {prop=app.project.activeItem.selectedLayers[0].property("ADBE Transform Group").property("ADBE Orientation");
        };
    Wind.close();

    var Data=File.openDialog ("Choose file", "Text files: *.txt", false);

    //make keyframes from file
    if(Data!=null){ 
        var keyValues=readDocument(Data,0); //read keyframe data
        var keyTimes=new Array(); //keyframes timing
        
        var fps=app.project.activeItem.frameRate;    
        for (i=0;i<keyValues.length;i++) {
            keyTimes[i]=i/fps; //1 datapoint = 1 frame 
        }

        //check dimensions
        app.beginUndoGroup("Keys");
        prop.setValuesAtTimes(keyTimes,keyValues); //set keyframes
        app.endUndoGroup();
    }
}

function readDocument(inputDoc,linesToSkip){
    var curDoc=new File(inputDoc);    
    var content=new Array();
    var str;
    
    if (curDoc.exists){
        curDoc.open("r");
        while(!curDoc.eof){
            str=curDoc.readln();
            content[content.length]=str.split("\t");
        }
    curDoc.close();
    content.splice(0,linesToSkip);
    }    

    return(content);
}

//open dialog
Wind.center();
Wind.show();