function Trideroche (space, parentNode, pos) {
	this.space = space;
	this.parentNode = parentNode;

	// Declare to let the class knows first
	// chipmunk objects
	this.head = null;
	this.body = null;
	this.frontBaseLeg = null;
	this.frontRearLeg = null;
	this.backBaseLeg = null;
	this.backRearLeg = null;

	// sprite objects
	this.headSprite = null;
	this.bodySprite = null;
	this.frontBaseLegSprite = null;
	this.frontRearLegSprite = null;
	this.backBaseLegSprite = null;
	this.backRearLegSprite = null;

	// create chipmunk objects
	this.addTrideroche(pos);
}
Trideroche.prototype.addTrideroche = function(p){
	var pos = cp.v(p.x, p.y);

	// add head
	this.head = this._addTrideroche_head(cp.v.add(cp.v(0, 40), pos));
	// add body
	this.body = this._addTrideroche_body(cp.v.add(cp.v(0, 0), pos));

	// add front leg
	this.frontBaseLeg = this._addTrideroche_baseleg(cp.v.add(cp.v(25,0), pos));
	this.frontBaseLeg.setAngle(cc.DEGREES_TO_RADIANS(45));
	this.frontRearLeg = this._addTrideroche_rearleg(cp.v.add(cp.v(50,0), pos), false);
	this.frontRearLeg.setAngle(cc.DEGREES_TO_RADIANS(-70));

	// add back leg
	this.backBaseLeg = this._addTrideroche_baseleg(cp.v.add(cp.v(-25,0), pos));
	this.backBaseLeg.setAngle(cc.DEGREES_TO_RADIANS(-45));
	this.backRearLeg = this._addTrideroche_rearleg(cp.v.add(cp.v(-50,0), pos), true);
	this.backRearLeg.setAngle(-cc.DEGREES_TO_RADIANS(-70));

	// add middle leg

	// joint
	// body & head
	this.space.addConstraint(new cp.GrooveJoint(this.body, this.head, cp.v(0,0), cp.v(0, 40), cp.v(0,0)));
	this.space.addConstraint(new cp.DampedSpring(this.body, this.head, cp.v(0,0), cp.v(0,0), 50, 300, 10));

	// body & base front leg
	this.space.addConstraint(new cp.PivotJoint(this.body, this.frontBaseLeg, cp.v(2.5,-20), cp.v(-25, 1)));
	// base front leg & rear front leg
	this.space.addConstraint(new cp.PivotJoint(this.frontBaseLeg, this.frontRearLeg, cp.v(25,1), cp.v(-60, 1.5)));

	// body & base back leg
	this.space.addConstraint(new cp.PivotJoint(this.body, this.backBaseLeg, cp.v(-2.5,-20), cp.v(25, 1)));
	// base back leg & rear back leg
	this.space.addConstraint(new cp.PivotJoint(this.backBaseLeg, this.backRearLeg, cp.v(-25,1), cp.v(60, 1.5)));
}
Trideroche.prototype._addTrideroche_head = function (cpV){
	var mass = 10;
	var radius = 20;
	var body = new cp.Body(mass, cp.momentForCircle(mass, 0, radius, cp.v(0,0)));
	body.setPos(cpV);
	this.space.addBody(body);

	var shape = new cp.CircleShape(body, radius, cp.v(0,0));
	shape.setElasticity(0.1);
	shape.setFriction(0.8);
	this.space.addShape(shape);

	return body;
}
Trideroche.prototype._addTrideroche_body = function (cpV) {
	var mass = 2;
	var width = 5;
	var height = 40;

	var body = new cp.Body(mass, cp.momentForBox(mass, width, height));
	body.setPos(cpV);
	this.space.addBody(body);

	var shape = new cp.BoxShape(body, width, height);
	shape.setElasticity(0);
	shape.setFriction(0.4);
	this.space.addShape(shape);

	return body;
}
Trideroche.prototype._addTrideroche_baseleg = function (cpV) {
	var mass = 7;	// change this later
	var width = 50;
	var height = 2;

	var body = new cp.Body(mass, cp.momentForBox(mass, width, height));
	body.setPos(cpV);
	this.space.addBody(body);

	var shape = new cp.BoxShape(body, width, height);
	shape.setElasticity(0);
	shape.setFriction(0.4);
	this.space.addShape(shape);

	return body;
}
Trideroche.prototype._addTrideroche_rearleg = function (cpV, isFlipVerts) {
	var mass = 7;
	var width = 120;
	var base_height = 3;

	var flip = 1.0;
	var verts = [];
	if(isFlipVerts)
	{
		flip = -1.0;

		verts = [
			0, base_height/2,
			0, -base_height/2,
			-width, 0
		];
	}
	else
	{
		verts = [
	    	0, base_height/2,
	    	width, 0,
	    	0, -base_height/2
		];
	}

	var body = new cp.Body(mass, cp.momentForPoly(mass, verts, cp.v(-60 * flip,0)));
	body.setPos(cpV);
	this.space.addBody(body);

	var shape = new cp.PolyShape(body, verts, cp.v(-60 * flip,0));
	shape.setElasticity(0.4);
	shape.setFriction(0.4);
	this.space.addShape(shape);

	return body;
}
