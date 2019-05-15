let width = window.innerWidth;
let height = window.innerHeight;
let camera, controls, scene, renderer;
let textLabels = [];
let plottedX = [];
let plottedW = [];
let iterations = 12;//parseInt(prompt("Number of iterations: "));
let maxHeight = 0;
var mouse = new THREE.Vector2();
var coordinateBox = document.getElementById("coordinateBox");

let cylinderColor = "#fce7b5";
let spiralColor = "#007484";
let pointColor = "black";
let textColor = "black";
let xAxisColor = "black";
let yAxisColor = "black";
let zAxisColor = "black";
let latexContainer = document.getElementById("latexContainer");

// Transformation matrix A
let A = [
    [ .8, .6, 0  ],
    [-.6, .8, 0  ],
    [  0,  0, 1.07]
];

window.addEventListener( 'mousemove', onMouseMove, false );

init();
plotPoints();
for (let i = 0; i < iterations; i++) {
    addLaTeX('x', i);
    addLaTeX('w', i);
}
MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
addLights();
createCylinder();
createAxes();
createConnections();
createSpiral();



render();
animate();

// Creates a TextLabel with the given text, parent, and text color
// The TextLabel will appear at the parent's coordinate
function TextLabel(text, parent, color) {
    let div = document.createElement("div");
    div.style.position = "absolute";
    div.innerHTML = text;
    div.className = "label clickThrough";
    div.style.top = 0;
    div.style.left = 0;
    div.style.width = 100;
    div.style.height = 100;
    div.style.color = color;
    this.element = div;
    this.position = new THREE.Vector3(0, 0, 0);
    this.parent = parent;
    this.update = function() {
        this.position.copy(this.parent.position);
        let coordinates = this.get2DCoordinates(this.position, camera);
        this.element.style.left = coordinates.x + "px";
        this.element.style.top = coordinates.y + "px";
    };
    this.get2DCoordinates = function(position) {
        let vector = position.project(camera);
        vector.x = (vector.x + 1)/2 * width - 10; 
        vector.y = -(vector.y - 1)/2 * height - 70;
        return vector;
    };
}

// Initializes camera, scene, lighting, renderer and controls
function init() {
    

    // Setup the orthographic camera
    let distance = 4.5;
    let ratio = width / height;
    camera = new THREE.OrthographicCamera(-distance * ratio, distance * ratio, distance, -distance, 1, 1000);
    
    camera.position.set(10, 8, 10);
    camera.up = new THREE.Vector3(0, 0, 1);
    camera.lookAt(0, 0, 0);

    // Initialize scene
    scene = new THREE.Scene();

    // Initialize raycaster for intersect detection
    raycaster = new THREE.Raycaster();

    // Initialize renderer
    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setClearColor( 0x000000, 0 );
    renderer.setSize(width, height);
    document.body.appendChild( renderer.domElement );

    // Set up camera and controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.rotateSpeed = .5;
    controls.enablePan = false;
    controls.addEventListener("change", render);

    // Gets variables from URL bar
    let vars = {};
    let parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    
    if ("iterations" in vars) {
        iterations = parseInt(vars["iterations"]) + 1;
    }
}

// Creates ambient and point lights for the scene
function addLights() {
    let ambient = new THREE.AmbientLight(0x202020);
    scene.add(ambient);
    
    let light1 = new THREE.PointLight(0xffffff, 2, 100, 1);
    light1.position.set(50, 30, -30);

    let light2 = new THREE.PointLight(0xffffff, 2, 100, 1);
    light2.position.set(-50, -30, -30);
    scene.add(light1);
    scene.add(light2);
}

// Creates the cylinder and adds it to the scene
function createCylinder() {
    maxHeight = plottedX[iterations - 1].z;
    
    let cylinderGeometry = new THREE.CylinderGeometry(2, 2, maxHeight, 40, 1, true, 0, Math.PI * 2);

    let material = new THREE.MeshPhongMaterial({
        color: cylinderColor,
        shininess: 0,
        opacity: 0.6,
        side: THREE.DoubleSide,
        transparent: true,
        depthWrite: false,
        // depthTest: false,
    });
    let cylinder = new THREE.Mesh(cylinderGeometry, material);
    cylinder.rotation.x = Math.PI/2;
    cylinder.position.z = maxHeight/2;
    
    scene.add(cylinder);
}

// Plots xi and wi on the graph.
function plotPoints() {
    plottedX[0] = new THREE.Vector3(2, 0, 1);
    plottedW[0] = new THREE.Vector3(2, 0, 0);
    plotPoint(plottedX[0], "\\[\\vec{x}_{0}\\]", pointColor);
    plotPoint(plottedW[0], "\\[\\vec{w}_{0}\\]", pointColor);

    for (let i = 1; i < iterations; i++) {
        plottedX[i] = transformByMatrix(plottedX[i - 1])
        plotPoint(plottedX[i], "\\[\\vec{x}_{" + i + "}\\]", pointColor);

        plottedW[i] = transformByMatrix(plottedW[i - 1])
        plotPoint(plottedW[i], "\\[\\vec{w}_{" + i + "}\\]", pointColor);
    }
    plottedX[iterations] = transformByMatrix(plottedX[iterations - 1]);
}

function addLaTeX(letter, index) {
    let point;
    if (letter == 'x') {
        point = plottedX[index];
    } else {
        point = plottedW[index];
    }

    let element = "<div class='coordinateBox clickThrough' id='" + letter + index + "'>"
    +"\\begin{bmatrix}"
    + point.x.toFixed(2) + "\\\\"
    + point.y.toFixed(2) + "\\\\"
    + point.z.toFixed(2)
    +"\\end{bmatrix}";
    + "</div>";

    latexContainer.innerHTML = latexContainer.innerHTML + element;
}

// Creates connections between xi and wi points.
function createConnections() {
    
    for (let i = 0; i < iterations; i++) {
        let connectionGeometry = new THREE.Geometry();
        connectionGeometry.vertices.push(plottedX[i]);
        connectionGeometry.vertices.push(plottedW[i]);
        let connectionMaterial = new THREE.LineBasicMaterial({color: "black"});
        let connection = new THREE.Line(connectionGeometry, connectionMaterial);
        scene.add(connection);
    }
}

// Creates spiral through xi points.
function createSpiral() {
    let pointsPerSegment = 6;

    let curve = new THREE.CatmullRomCurve3();
    curve.points.push(new THREE.Vector3(1.6, -1.2, 1/1.07))
    for (let i = 0; i < iterations; i++) {
        curve.points.push(plottedX[i]);
    }
    curve.points.push(plottedX[iterations]);
    let points = curve.getPoints((iterations + 1) * pointsPerSegment);

    let splicedPoints = points.splice(pointsPerSegment, (iterations-1)*pointsPerSegment+1);
    let spline = new THREE.SplineCurve3(splicedPoints);
    let geometry = new THREE.TubeGeometry(spline, splicedPoints.length, 0.03, 8, false);
    let material = new THREE.MeshBasicMaterial({color: spiralColor});
    let mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
}

function transformByMatrix(v) {
    let x = v.x * A[0][0] + v.y * A[1][0] + v.z * A[2][0];
    let y = v.x * A[0][1] + v.y * A[1][1] + v.z * A[2][1];
    let z = v.x * A[0][2] + v.y * A[1][2] + v.z * A[2][2];
    return new THREE.Vector3(x, y, z);
}

// Creates geometry for axes, axis pointers, and axis labels
function createAxes() {

    // Create axes
    let xAxisGeometry = new THREE.Geometry();
    xAxisGeometry.vertices.push(new THREE.Vector3(-3, 0, 0));
    xAxisGeometry.vertices.push(new THREE.Vector3( 3, 0, 0));
    
    let yAxisGeometry = new THREE.Geometry();
    yAxisGeometry.vertices.push(new THREE.Vector3(0,-3, 0));
    yAxisGeometry.vertices.push(new THREE.Vector3(0, 3, 0));
    
    let zAxisGeometry = new THREE.Geometry();
    zAxisGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    zAxisGeometry.vertices.push(new THREE.Vector3(0, 0, maxHeight));

    let xAxisMaterial = new THREE.LineBasicMaterial({color: xAxisColor});
    let yAxisMaterial = new THREE.LineBasicMaterial({color: yAxisColor});
    let zAxisMaterial = new THREE.LineBasicMaterial({color: zAxisColor});

    let xAxis = new THREE.Line(xAxisGeometry, xAxisMaterial);
    let yAxis = new THREE.Line(yAxisGeometry, yAxisMaterial);
    let zAxis = new THREE.Line(zAxisGeometry, zAxisMaterial);

    scene.add(xAxis);
    scene.add(yAxis);
    scene.add(zAxis);

    // Axis arrows
    let xConeGeometry = new THREE.ConeGeometry(0.05, 0.3, 10);
    let yConeGeometry = new THREE.ConeGeometry(0.05, 0.3, 10);
    let zConeGeometry = new THREE.ConeGeometry(0.05, 0.3, 10);

    let xConeMaterial = new THREE.MeshPhongMaterial({color: xAxisColor});
    let yConeMaterial = new THREE.MeshPhongMaterial({color: yAxisColor});
    let zConeMaterial = new THREE.MeshPhongMaterial({color: zAxisColor});
    let xCone = new THREE.Mesh(xConeGeometry, xConeMaterial);
    let yCone = new THREE.Mesh(yConeGeometry, yAxisMaterial);
    let zCone = new THREE.Mesh(zConeGeometry, zAxisMaterial);

    xCone.rotation.z = -Math.PI/2;
    xCone.position.x = 3;

    yCone.position.y = 3;

    zCone.rotation.x = Math.PI/2;
    zCone.position.z = maxHeight;
    
    // scene.add(xCone);
    // scene.add(yCone);
    // scene.add(zCone);

    // Create text labels for axes
    let xLabel = new TextLabel("\\[x_1\\]", xCone, xAxisColor);
    let yLabel = new TextLabel("\\[x_2\\]", yCone, yAxisColor);
    let zLabel = new TextLabel("\\[x_3\\]", zCone, zAxisColor);
    xLabel.element.className = "label clickThrough";
    yLabel.element.className = "label clickThrough";
    zLabel.element.className = "label clickThrough";
    textLabels.push(xLabel);
    textLabels.push(yLabel);
    textLabels.push(zLabel);
    document.body.appendChild(xLabel.element);
    document.body.appendChild(yLabel.element);
    document.body.appendChild(zLabel.element);
}

// Plots the given point on the graph
// Creates text label for the point with the given name
function plotPoint(v, name, color) {

    let sphereGeometry = new THREE.SphereGeometry(0.04, 16, 16);
    let sphereMaterial = new THREE.MeshBasicMaterial({color: color});
    let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.name = name.substring(name.indexOf("{") + 1, name.indexOf("}")) + name.substring(name.lastIndexOf("{") + 1, name.lastIndexOf("}")); // \\[\\vec{x}_i\\]
    // console.log(sphere.name);
    scene.add(sphere);
    
    sphere.position.copy(v);

    let label = new TextLabel(name, sphere, textColor);
    textLabels.push(label);
    document.body.appendChild(label.element);
}

// Updates mouse position
function onMouseMove( event ) {

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(scene.children);

    for (let i = 0; i < latexContainer.children.length; i++) {
        latexContainer.children[i].style.display = "none";
    }
    for (let i = 0; i < intersects.length; i++) {
        let name = intersects[i].object.name;
        if (name != "") {
            let element = document.getElementById(name);

            element.style.top = event.clientY - 50 + "px";
            element.style.left = event.clientX + 25 + "px";
            element.style.display = "block";
        }
    }

}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    for (let i = 0; i < textLabels.length; i++) {
        textLabels[i].update();
    }
}

function render() {
    renderer.render( scene, camera );
}