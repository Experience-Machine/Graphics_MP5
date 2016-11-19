/* 
 * File: MainController.js
 * Container controller for the entire world
 */

/*jslint node: true, vars: true, bitwise: true */
/*global angular, document, ClassExample, Camera, CanvasMouseSupport */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";

// Creates the "backend" logical support for appMyExample
var myModule = angular.module("appMyExample", ["CSS450Timer", "CSS450Slider", "CSS450Xform"]);

// registers the constructor for the controller
// NOTE: the constructor is only called _AFTER_ the </body> tag is encountered
//       this code does NOT run until the end of loading the HTML page
myModule.controller("MainCtrl", function ($scope) {
    // Initialize the graphics system
    gEngine.Core.initializeWebGL('GLCanvas');
    $scope.mCanvasMouse = new CanvasMouseSupport('GLCanvas');
    
    $scope.mMyWorld = new ClassExample();
    $scope.mView = new Camera(
         [0, 0],
         80,
         [0, 0, 800, 600]);
    
    $scope.mSelectedXform = $scope.mMyWorld.currentObject().getXform();
    $scope.mMyImagePath = null;
        
    $scope.mUseShader = [
        {label: "Constant Color", value: "Constant"},
        {label: "Per Vertex Color", value:"PerVertex"},
        {label: "File Texture", value:"FileTexture"}
    ];
    $scope.mSelectedShader = $scope.mUseShader[0].value;
    $scope.selectShader = function() {
        switch ($scope.mSelectedShader) {
            case $scope.mUseShader[0].value:
                 $scope.mMyWorld.setConstShader();
                break;
            case $scope.mUseShader[1].value:
                $scope.mMyWorld.setVertexColorShader();
                break;
            case $scope.mUseShader[2].value:
                $scope.mMyWorld.setFileTextureShader();
                break;
        }
    };

    $scope.mainTimerHandler = function () {
        $scope.mMyWorld.update();
        gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1]);        // Clear the canvas
        $scope.mMyWorld.draw($scope.mView);
    };

    $scope.defineSquare = function (event) 
    {
        var mWCX = $scope.mView.mouseWCX($scope.mCanvasMouse.getPixelXPos(event));
        var mWCY = $scope.mView.mouseWCY($scope.mCanvasMouse.getPixelYPos(event));
        
        if($scope.mMyWorld.select(mWCX, mWCY))
        {
            $scope.mSelectedXform = $scope.mMyWorld.currentObject().getXform();
        }
        else
        {
            $scope.mMyWorld.defineCenter(
                mWCX,
                mWCY);
            $scope.mSelectedXform = $scope.mMyWorld.currentObject().getXform();
        }
        $scope.mForceRedraw = true;
    };

    $scope.dragSquare = function (event) {
        // console.log("dragging");
        switch (event.which) {
        case 1: // left
            $scope.mMyWorld.defineWidth(
                $scope.mView.mouseWCX($scope.mCanvasMouse.getPixelXPos(event)),
                $scope.mView.mouseWCX($scope.mCanvasMouse.getPixelYPos(event)));
            $scope.mForceRedraw = true;
            break;
        }
    };
    
    $scope.squareDefined = function(event)
    {
        switch (event.which) {
        case 1: // left
            $scope.mMyWorld.defined();
            $scope.mForceRedraw = true;
            break;
        }
    };
    
    $scope.acceptFiles = function (event) {
        var input = event.target;
        var reader = new FileReader();
        reader.onload = function () {
            // hacky for now
            $scope.mMyImage = new Image();
            $scope.mMyImage.src = reader.result;
            $scope.mMyWorld.newFileTexture(reader.result, false);
        };
        $scope.mMyImagePath = input.files[0];
        reader.readAsDataURL(input.files[0]);
    };

});