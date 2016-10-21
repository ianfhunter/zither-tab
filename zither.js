jsPlumb.ready(function() {
  vf();
  pump();
});

voice = 0
glue = 0
note_counter = 0
note_order = []
string_load=[
              [0,0,0,0,0,0,0,0,0,0,0,0],
              [0,0,0,0,0,0,0,0,0,0,0,0],
              [0,0,0,0,0,0,0,0,0,0,0,0],
              [0,0,0,0,0,0,0,0,0,0,0,0],
              [0,0,0,0,0,0,0,0,0,0,0,0],
              [0,0,0,0,0,0,0,0,0,0,0,0],
              [0,0,0,0,0,0,0,0,0,0,0,0],
              [0,0,0,0,0,0,0,0,0,0,0,0],
              [0,0,0,0,0,0,0,0,0,0,0,0],
              [0,0,0,0,0,0,0,0,0,0,0,0],
              [0,0,0,0,0,0,0,0,0,0,0,0],
              [0,0,0,0,0,0,0,0,0,0,0,0],
              [0,0,0,0,0,0,0,0,0,0,0,0],
              [0,0,0,0,0,0,0,0,0,0,0,0],
              [0,0,0,0,0,0,0,0,0,0,0,0],
              [0,0,0,0,0,0,0,0,0,0,0,0]
            ]

function vf(){
  VF = Vex.Flow;
  // Create an SVG renderer and attach it to the DIV element named "boo".
  var div = document.getElementById("sheet")
  var renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
  // Configure the rendering context.
  renderer.resize(500, 200);
  var context = renderer.getContext();
  context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");

  // Create a stave of width 400 at position 10, 0 on the canvas.
  var stave = new VF.Stave(10, 0, 400);

  // Add a clef and time signature.
  stave.addClef("treble");

  // Connect it to the rendering context and draw!
  stave.setContext(context).draw();

  var notes = [
    // Low to h
    new VF.StaveNote({ keys: ["a/3"], duration: "q" }),
    new VF.StaveNote({ keys: ["b/3"], duration: "q" }),
    new VF.StaveNote({ keys: ["c/4"], duration: "q" }),
    new VF.StaveNote({ keys: ["d/4"], duration: "q" }),
    new VF.StaveNote({ keys: ["e/4"], duration: "q" }),
    new VF.StaveNote({ keys: ["f/4"], duration: "q" }),
    new VF.StaveNote({ keys: ["g/4"], duration: "q" }),
    new VF.StaveNote({ keys: ["a/4"], duration: "q" }),
    new VF.StaveNote({ keys: ["b/4"], duration: "q" }),
    new VF.StaveNote({ keys: ["c/5"], duration: "q" }),
    new VF.StaveNote({ keys: ["d/5"], duration: "q" }),
    new VF.StaveNote({ keys: ["e/5"], duration: "q" }),
  ]
  voice = new VF.Voice({num_beats: 12,  beat_value: 4});
  // var voice = new VF.Voice();
  voice.addTickables(notes);
  var formatter = new VF.Formatter().joinVoices([voice]).format([voice], 360);
  // Render voice
  voice.draw(context, stave);
  //
  // var item = staveNote.getElem();
  // Vex.forEach($(item).find("*"), function(child) {
  //               child.setAttribute("fill", "green");
  //               child.setAttribute("stroke", "green");
  //             });
  $(".vf-note path").hover(function(){
      $(this).attr("fill","yellow")
      $(this).attr("stroke","yellow")
    },function(){
      $(this).attr("fill","black")
      $(this).attr("stroke","black")
  });
  $(".vf-stavenote").click(function(){
    for (var x in voice.tickables) {
      if(this.id.replace("vf-","") == voice.tickables[x].attrs.id){
        add_note(voice.tickables[x].keys[0])
        console.log("the note is ", voice.tickables[x].keys[0])
      }
    }

  });
}

function pump(){
  glue = jsPlumb.getInstance({
    PaintStyle:{
      lineWidth:1,
      strokeStyle:"#567567",
      outlineColor:"black",
      outlineWidth:1
    },
    Connector:[ "Bezier", { curviness: 3 } ],
    Endpoint:[ "Dot", { radius:1 } ],
    EndpointStyle : { fillStyle: "#567567"  },
    Anchor : [ 0.5, 0.5, 1, 1 ]
  });
  // firstInstance.importDefaults({
  //   Connector : [ "Bezier", { curviness: 150 } ],
  //   Anchors : [ "TopCenter", "BottomCenter" ]
  // });


    // glue.connect({
    //   source:"note_2",
    //   target:"note_3",
    //   scope:"someScope"
    // });
}

function add_note(note){
  key_table = {
    "a/3":12,
    "b/3":11,
    "c/4":10,
    "d/4":9,
    "e/4":8,
    "f/4":7,
    "g/4":6,
    "a/4":5,
    "b/4":4,
    "c/5":3,
    "d/5":2,
    "e/5":1
  }
  str_num = key_table[note]
  strid = "#string_"+ str_num +" .notes"
  noteid = 'note_'+note_counter
  $(strid).append('<div class="note crotchet" style="margin-left:'+calc_offset(str_num, string_load)+'px" id="'+noteid+'"></div>')

  if(note_order.length >= 1){
    previd = note_order[note_order.length -1]
    note_order.push('note_'+note_counter)

    glue.connect({
      source:noteid,
      target:previd,
      scope:"someScope"
    });
  }else{
    note_order.push(noteid)
    $("#"+noteid).css("border-color","orange")
  }
  note_counter++;
  for( x in string_load){
    string_load[x][str_num - 1]++
  }

}


function calc_offset(active, load) {
  below_idx = active
  curr_idx = active -1
  above_idx = active -2

  curr_load = load[curr_idx]

  //Neighbours +1,-1
  // <editor-fold> Region

  if(active == 12){
    below_load = -1
  }else{
    below_load = curr_load[below_idx] // Down a string
  }

  current_load = curr_load[curr_idx]

  if(active == 1){
    above_load = -1
  }else{
    above_load = curr_load[above_idx] // Up a string
  }

  // Okay Cases
  if(below_load != -1 && below_load - current_load > 3){
     curr_load[below_idx] = 0
     curr_load[curr_idx] = 0
     console.log("Offset: ",below_load , current_load)
     console.log("Offset: ",(below_load - current_load)*30);
     return (below_load - current_load)*30;
  }
  if(above_load != -1 && above_load - current_load > 3){
    curr_load[above_idx] = 0
    curr_load[curr_idx] = 0
    console.log("Offset: ",above_load , current_load)
    console.log("Offset: ",(above_load - current_load)*30)
    return (above_load - current_load)*30;
  }

  // </editor-fold>

//Neighbours +2,-2
  below_idx = active + 1
  above_idx = active - 3

  if(active >= 11){
    below_load = -1
  }else{
    below_load = curr_load[below_idx] // Down a string
  }

  current_load = curr_load[curr_idx]

  if(active <= 2){
    above_load = -1
  }else{
    above_load = curr_load[above_idx] // Up a string
  }

// Okay Cases
if(below_load != -1 && below_load - current_load > 3){
   curr_load[below_idx] = 0
   curr_load[curr_idx] = 0
   console.log("Offset: ",below_load , current_load)
   console.log("Offset: ",(below_load - current_load)*30);
   return (below_load - current_load)*30;
}
if(above_load != -1 && above_load - current_load > 3){
  curr_load[above_idx] = 0
  curr_load[curr_idx] = 0
  console.log("Offset: ",above_load , current_load)
  console.log("Offset: ",(above_load - current_load)*30)
  return (above_load - current_load)*30;
}


  return 0;

}
