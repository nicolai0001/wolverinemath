/**
* @title Unit Circle
* @description This interactive demonstrates the properties of the unit circle in relation to the trigonometric functions sine, cosine, and tangent.
* @tags [math]
* @date October 9, 2019
* @author Kurt Bruns
* @weight 1
*/
import { Interactive, BaseElement } from '../../index.js';
import { parseSVG } from '../../util/svg.js';
/**
* This wrapper object is how the circular dependecy between control elements is
* made more simple. Since all of the elements depend on the current angle when
* an input is changed then this element is updated and the change is
* propegated through the dependency graph.
*/
class NumberWrapper extends BaseElement {
    _value;
    constructor(value) {
        super();
        this._value = value;
    }
    get value() {
        return this._value;
    }
    set value(value) {
        this._value = value;
        this.updateDependents();
    }
}
class UnitCircle {
    _angle;
    f;
    constructor(id, angle, func = Math.cos) {
    }
    set angle(value) {
    }
    get angle() {
        return this._angle;
    }
}
/**
* This main interactive contains the four components: the unit circle, the
* function graph, the variables, and the trigonometric functions.
*/
export default function main(id, opts) {
    /**
    * Default options for this interactive
    */
    let defaultOptions = {
        angle: 1,
        func: Math.cos
    };
    let interactive = new Interactive(id);
    let width = 400;
    let scale = (8/9)*width / Math.PI;
    let radius = scale;
    let margin = 2 * radius - width / 2;
    interactive.height = width + margin + width;
    interactive.width = margin + 2 * width + 2;
    let f = Math.cos;
    /**
    * This angle is the main element that most of the control
    * points both update and depend on.
    */
    let angle = new NumberWrapper(0);
    /**
    * Displays the unit circle.
    */
    let circleInteractive = interactive.interactive(0, 0);
    let circleRectangle = circleInteractive.rectangle(-width / 2, -width / 2, width, width);
    circleRectangle.classList.add('default');
    circleInteractive.height = width;
    circleInteractive.width = width;
    circleInteractive.originX = circleInteractive.width / 2;
    circleInteractive.originY = circleInteractive.height / 2;
    /**
    * Displays the value of the variables and a button for
    * animating the interactive.
    */
    let info = interactive.interactive(width + margin, 0);
    info.width = width;
    info.height = width;
    // TODO: setting the border to true doesn't work?
    let infoRect = info.rectangle(0, 0, info.width, info.height);
    infoRect.classList.add('default');
    // Unit Circle Section
    let circle = circleInteractive.circle(0, 0, radius);
    circle.style.fill = 'none';
    circle.style.stroke = '#333333';
    let control = circleInteractive.control(circle.r, 0);
    control.constrainTo(circle);
    control.addDependency(angle);
    control.update = function () {
        this.x = circle.r * Math.cos(angle.value);
        this.y = -circle.r * Math.sin(angle.value);
    };
    control.onchange = function () {
        if (control.y <= 0) {
            angle.value = Math.abs(Math.atan2(control.y, control.x));
        }
        else {
            angle.value = Math.PI * 2 - Math.atan2(control.y, control.x);
        }
    };
    let hypotenuse = circleInteractive.line(0,0,circle.r,0);
    hypotenuse.addDependency(control);
    hypotenuse.update = function () {
        this.x2 = control.x;
        this.y2 = control.y;
    };

let cosineLeg = circleInteractive.line(0,0,circle.r,0);
    cosineLeg.addDependency(hypotenuse);
    cosineLeg.update = function () {
        this.x2 = hypotenuse.x2;
    };
    cosineLeg.style.stroke = '#ff0000';

    let sineLeg = circleInteractive.line(0,0,0,circle.r);
    sineLeg.addDependency(hypotenuse);
    sineLeg.update = function () {
        this.y2 = hypotenuse.y2;
        this.x1 = hypotenuse.x2;
        this.x2 = this.x1;
    };
    sineLeg.style.stroke = '#0000ff';
    circleInteractive.circle(0, 0, 3).style.fill = '#404040';
    // draw gridlines
    circleInteractive.background.classList.add('default');
    for (let i = -3; i <= 3; i++) {
        for (let j = -3; j <= 3; j++) {
            let rect2 = circleInteractive.rectangle(i * circle.r, j * circle.r, circle.r, circle.r);
            circleInteractive.background.prependChild(rect2);
            rect2.root.setAttribute('vector-effect', 'non-scaling-stroke');
            rect2.style.strokeOpacity = '.25';
        }
    }
    angle.value = 1;

    //idk what im doing but i want to label important values
    interactive.text(radius*(2+(11/15)) + radius/7, circleInteractive.height - radius*(1+(11/15)), '(1 , 0)')
    interactive.text(radius/(2+(11/15)) + -radius/14, circleInteractive.height - radius*(1+(11/15)), '(-1 , 0)')
    interactive.text(radius*2*(11/15) + radius/7, circleInteractive.height - radius*(2+(11/15)) - radius/7, '(0 , 1)')
    interactive.text(radius*2*(11/15) + radius/7, circleInteractive.height - 4*radius/7, '(0 , -1)')
    interactive.text(radius*(2+(11/15)) - 2*radius/7, circleInteractive.height - radius*(2+(11/15)), '(√2/2 , √2/2)')
    interactive.text(radius/(2+(11/15)) + -radius/28, circleInteractive.height - radius*(2+(11/15)), '(-√2/2 , √2/2)')
    interactive.text(radius/(2+(11/15)) + -radius/28, circleInteractive.height - 5*radius/7, '(-√2/2 , -√2/2)')
    interactive.text(radius*(2+(11/15)) - 2*radius/7, circleInteractive.height - 5*radius/7, '(√2/2 , -√2/2)')

    // Info section
    let x = width/2 - 2*margin;
    let thetaDisplay = info.text(x, info.height * 1 / 5, "θ = ...");
    let xDisplay = info.text(x, info.height * 2 / 5, "cosθ = ...");
    xDisplay.style.stroke = '#ff0000';
    let yDisplay = info.text(x, info.height * 3 / 5, "sinθ = ...");
    yDisplay.style.stroke = '#0000ff';
    thetaDisplay.addDependency(control);
    thetaDisplay.update = function () {
        thetaDisplay.contents = `θ = ${(getAngle()/Math.PI).toFixed(3)}π = ${(getAngle()*180/Math.PI).toFixed(3)}°`;
        // thetaDisplay.contents = `θ = ${getAngle().toFixed(2)} or ${(getAngle()/(2*Math.PI)).toFixed(2)}τ`;
    };
    xDisplay.addDependency(control);
    xDisplay.update = function () {
        xDisplay.contents = `cosθ = ${(control.x / circle.r).toFixed(3)}`;
    };
    yDisplay.addDependency(control);
    yDisplay.update = function () {
        yDisplay.contents = `sinθ = ${(-control.y / circle.r).toFixed(3)}`;
    };
    
    let requestID = 0;
    let animating = false;
    let animate = info.button(x, info.height * 4 / 5, "animate");
    animate.onclick = function () {
        let step = function (timestamp) {
            angle.value += .01;
            angle.value = angle.value % (2 * Math.PI);
            // chartControl.onchange();
            requestID = window.requestAnimationFrame(step);
        };
        if (animating) {
            window.cancelAnimationFrame(requestID);
            animating = false;
        }
        else {
            animating = true;
            requestID = window.requestAnimationFrame(step);
        }
    };
    control.x = circle.r * Math.cos(1);
    control.y = -circle.r * Math.sin(1);
    control.updateDependents();
    // Gets the normalized angle between zero and tau. TODO: Maybe transform the
    // coordinate system so that the positive y-direction is up instead of down.
    // UPDATE: transform = 'scale(1,-1)' applied to the main svg  didn't quite work
    // as expected: the text element was upside down, but maybe that could be
    // reversed? bleh.
    function getAngle() {
        if (control.y <= 0) {
            return Math.abs(Math.atan2(control.y, control.x));
        }
        else {
            return Math.PI * 2 - Math.atan2(control.y, control.x);
        }
    }
}
//# sourceMappingURL=unit-circle.js.map