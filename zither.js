jsPlumb.ready(function() {
  vf();
  pump();
});

voice = 0
glue = 0
note_counter = 0
note_order = []
string_load=[
  240,
  220,
  200,
  180,
  160,
  140,
  120,
  100,
  80,
  60,
  40,
  20
]
base_load = [
  240,
  220,
  200,
  180,
  160,
  140,
  120,
  100,
  80,
  60,
  40,
  20
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
    for (var x = 0; x != voice.tickables.length; x++) {
      if(this.id.replace("vf-","") == voice.tickables[x].attrs.id){
        add_note(voice.tickables[x].keys[0])
        // console.log("the note is ", voice.tickables[x].keys[0])
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
    Connector:[ "Straight"],
    Endpoint:[ "Dot", { radius:1 } ],
    EndpointStyle : { fillStyle: "#567567"  },
    Anchor : [ 0.5, 0.5, 1, 1 ]
  });
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
  $(strid).append('<div class="note crotchet" style="margin-left:'+calc_offset(str_num, string_load, base_load)+'px" id="'+noteid+'"></div>')

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

function mymax(a, b)  //A = Load values, B = Base values for normalization
{
    var m = -Infinity, i = 0, n = a.length;
    var idx = 0

    for (; i != n; ++i) {
        if (a[i] - b[i] > m) {
            m = a[i] - b[i];
            idx = i
        }
    }

    return [m, i];
}


function calc_offset(active, load, base) {
  curr_idx = active -1
  string_amount = 12
  cl = load[curr_idx]
  bl = base[curr_idx]
  ml = mymax(load, base);
  mix = ml[1]
  ml = ml[0]

  norml = cl - bl

  console.log("Curr:",cl, " Norm:",norml," Max:",ml, " Base:", bl);

  // for (var i = 0; i != string_amount; i++) {
  node_size = 20
  load[curr_idx] = bl + ml + node_size
  retval = ml - norml + node_size // plus this node

  console.log(retval)

  return retval
}
