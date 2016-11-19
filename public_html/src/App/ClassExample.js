/*
 * File: MyGame.js 
 * This is the logic of our game. For now, this is very simple.
 */
/*jslint node: true, vars: true */
/*global gEngine, SimpleShader, SquareRenderable, SceneNode, ArmSegment */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function ClassExample() {
    
    this.mConstColorShader = new SimpleShader(
        "src/GLSLShaders/SimpleVS.glsl",      // Path to the VertexShader 
        "src/GLSLShaders/SimpleFS.glsl");    // Path to the simple FragmentShader
    
    this.mVertexColorShader = new ColorVertexShader(
        "src/GLSLShaders/ColorVertexVS.glsl",      // Path to the VertexShader 
        "src/GLSLShaders/ColorVertexFS.glsl");    // Path to the simple FragmentShader
    
    this.mFileTextureShader = new FileTextureShader(
        "src/GLSLShaders/TextureVS.glsl",      // Path to the VertexShader 
        "src/GLSLShaders/TextureFS.glsl");    // Path to the simple FragmentShader
    
    this.mCurrentObject = new ArmSegment(this.mConstColorShader, "newShape", 0, 0);
    this.mFileTexture = new FileTextureSupport("assets/minion_portal.png", true);

    this.mCurrentObject.getXform().setPosition(20, 20);
    this.mCurrentObject.getXform().setSize(20, 20);
    this.mCurrentObject.getXform().setDestination(0,0);
    
    this.mAllObjects = [];
    
    this.vmUseRandomColor = false;
    this.setConstShader();
};

ClassExample.prototype.draw = function (camera) {
    // Step F: Starts the drawing by activating the camera
    camera.setupViewProjection();

    // centre red square
    var i;
    for (i=0; i<this.mAllObjects.length; i++)
        this.mAllObjects[i].draw(camera);
};

// Determine if any objects contain the point
// If they contain the point, they become selected
ClassExample.prototype.select = function(x, y)
{
    var i;
    for (i=0; i<this.mAllObjects.length; i++)
        if(this.mAllObjects[i].containsPoint(x, y))
        {
            this.mCurrentObject = this.mAllObjects[i];
            return true;
        }
    return false;
};