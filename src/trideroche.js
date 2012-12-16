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
	this.middleBaseLeg = null;
	this.middleRearLeg = null;

	this.frontFoot = null;
	this.backFoot = null;
	this.middleFoot = null;

	// sprite objects
	this.headSprite = null;
	this.bodySprite = null;
	this.frontBaseLegSprite = null;
	this.frontRearLegSprite = null;
	this.backBaseLegSprite = null;
	this.backRearLegSprite = null;
	this.middleBaseLegSprite = null;
	this.middleRearLegSprite = null;

	this.frontFootSprite = null;
	this.backFootSprite = null;
	this.middleFootSprite = null;

	// internal variables
	this._frontLegLabel = cc.LabelTTF.create("1", "AtariClassic", 15);
	this._frontLegLabel.setColor(cc.c3b(255,255,255));
	this._backLegLabel = cc.LabelTTF.create("2", "AtariClassic", 15);
	this._backLegLabel.setColor(cc.c3b(0,255,255));
	this._middleLegLabel = cc.LabelTTF.create("3", "AtariClassic", 15);
	this._middleLegLabel.setColor(cc.c3b(255,255,0));
	this.parentNode.addChild(this._frontLegLabel);
	this.parentNode.addChild(this._backLegLabel);
	this.parentNode.addChild(this._middleLegLabel);

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
	this.frontBaseLeg = this._addTrideroche_baseleg(cp.v.add(cp.v(100,20), pos));
	this.frontBaseLeg.setAngle(cc.DEGREES_TO_RADIANS(45));
	this.frontRearLeg = this._addTrideroche_rearleg(cp.v.add(cp.v(150,30), pos), false);
	this.frontRearLeg.setAngle(cc.DEGREES_TO_RADIANS(-70));

	// add back leg
	this.backBaseLeg = this._addTrideroche_baseleg(cp.v.add(cp.v(-10,20), pos));
	this.backBaseLeg.setAngle(cc.DEGREES_TO_RADIANS(-45));
	this.backRearLeg = this._addTrideroche_rearleg(cp.v.add(cp.v(-150,30), pos), true);
	this.backRearLeg.setAngle(-cc.DEGREES_TO_RADIANS(-70));

	// add middle leg
	this.middleBaseLeg = this._addTrideroche_baseleg(cp.v.add(cp.v(30,20), pos));
	this.middleBaseLeg.setAngle(cc.DEGREES_TO_RADIANS(60));
	this.middleRearLeg = this._addTrideroche_rearleg(cp.v.add(cp.v(50,30), pos), true);
	this.middleRearLeg.setAngle(-cc.DEGREES_TO_RADIANS(-80));

	// virtual feet
	this.frontFoot = this._addFoot(cp.v.add(cp.v(50,25), pos));
	this.backFoot = this._addFoot(cp.v.add(cp.v(-50,25), pos));
	this.middleFoot = this._addFoot(cp.v.add(cp.v(25,30), pos));

	// joint
	// body & head
	this.space.addConstraint(new cp.GrooveJoint(this.body, this.head, cp.v(0,0), cp.v(0, 10), cp.v(0,0)));
	this.space.addConstraint(new cp.DampedSpring(this.body, this.head, cp.v(0,0), cp.v(0,0), 50, 300, 10));

	// body & base front leg
	this.space.addConstraint(new cp.PivotJoint(this.body, this.frontBaseLeg, cp.v(2.5,-10), cp.v(-25,1)));
	//this.space.addConstraint(new cp.RotaryLimitJoint(this.body, this.frontBaseLeg, -Math.PI/4, Math.PI/4));
	// base front leg & rear front leg
	this.space.addConstraint(new cp.PivotJoint(this.frontBaseLeg, this.frontRearLeg, cp.v(25,1), cp.v(-60, 1.5)));

	// body & base back leg
	this.space.addConstraint(new cp.PivotJoint(this.body, this.backBaseLeg, cp.v(-2.5,-10), cp.v(25, 1)));
	//this.space.addConstraint(new cp.RotaryLimitJoint(this.body, this.backBaseLeg, -Math.PI/4, Math.PI/4));
	// base back leg & rear back leg
	this.space.addConstraint(new cp.PivotJoint(this.backBaseLeg, this.backRearLeg, cp.v(-25,1), cp.v(60, 1.5)));
	//this.space.addConstraint(new cp.RotaryLimitJoint(this.backBaseLeg, this.backRearLeg, -Math.PI/4, Math.PI/4));

	// body & base middle leg
	this.space.addConstraint(new cp.PivotJoint(this.body, this.middleBaseLeg, cp.v(0,-10), cp.v(25,1)));
	//this.space.addConstraint(new cp.RotaryLimitJoint(this.body, this.middleBaseLeg, -Math.PI/4, Math.PI/4));
	// base middle leg & rear middle leg
	this.space.addConstraint(new cp.PivotJoint(this.middleBaseLeg, this.middleRearLeg, cp.v(-25,1), cp.v(60, 1.5)));
	//this.space.addConstraint(new cp.RotaryLimitJoint(this.middleBaseLeg, this.middleRearLeg, -Math.PI/4, Math.PI/4));

	// associate with foot
	// front
	this.space.addConstraint(new cp.PivotJoint(this.frontRearLeg, this.frontFoot, cp.v(60, 0), cp.v(0,2.5)));
	this.space.addConstraint(new cp.PivotJoint(this.backRearLeg, this.backFoot, cp.v(-60, 0), cp.v(0,2.5)));
	this.space.addConstraint(new cp.PivotJoint(this.middleRearLeg, this.middleFoot, cp.v(-60, 0), cp.v(0,2.5)));
}
Trideroche.prototype.update = function() {
	// update position of labels
	this._frontLegLabel.setPosition(cc.p(this.frontFoot.getPos().x, this.frontFoot.getPos().y + 40));
	this._backLegLabel.setPosition(cc.p(this.backFoot.getPos().x, this.backFoot.getPos().y + 40));
	this._middleLegLabel.setPosition(cc.p(this.middleFoot.getPos().x, this.middleFoot.getPos().y + 40));
}
Trideroche.prototype.onKeyDown = function (e) {
	// Front foot - Forward
	if(e == cc.KEY.a)
	{
		var pos = this.frontFoot.getPos();
		this.frontFoot.setVel(cp.v(150,150));
		global.log("Front foot moved forward");
	}
	// Back foot - Forward
	if(e == cc.KEY.s)
	{
		var pos = this.backFoot.getPos();
		this.backFoot.setVel(cp.v(150,150));
		global.log("Back foot moved forward");
	}
	// Middle foot - Forward
	if(e == cc.KEY.d)
	{
		var pos = this.middleFoot.getPos();
		this.middleFoot.setVel(cp.v(150,150));
		global.log("Middle foot moved forward");
	}

	// Front foot - Backward
	if(e == cc.KEY.z)
	{
		var pos = this.frontFoot.getPos();
		this.frontFoot.setVel(cp.v(-150,150));
		global.log("Front foot moved backward");
	}
	// Back foot - Backward
	if(e == cc.KEY.x)
	{
		var pos = this.backFoot.getPos();
		this.backFoot.setVel(cp.v(-150,150));
		global.log("Back foot moved backward");
	}
	// Middle foot - Backward
	if(e == cc.KEY.c)
	{
		var pos = this.middleFoot.getPos();
		this.middleFoot.setVel(cp.v(-150,150));
		global.log("Middle foot moved backward");
	}

	// Front foot - Up
	if(e == cc.KEY.q)
	{
		var pos = this.frontFoot.getPos();
		this.frontFoot.setPos(cp.v(0, pos.y + 20));
		global.log("Front foot moved up");

		//this.frontFoot.applyForce(cp.v(-8000,0), cp.v(0,0));
	}
	// Back foot - Up
	if(e == cc.KEY.w)
	{
		var pos = this.backFoot.getPos();
		this.backFoot.setPos(cp.v(0, pos.y + 20));
		global.log("Back foot moved up");

		//this.backFoot.applyForce(cp.v(-8000,0), cp.v(0,0));
	}
	// Middle foot - Up
	if(e == cc.KEY.e)
	{
		var pos = this.middleFoot.getPos();
		this.middleFoot.setPos(cp.v(0, pos.y + 20));
		global.log("Middle foot moved up");

		//this.middleFoot.applyForce(cp.v(-8000,0), cp.v(0,0));
	}
}
Trideroche.prototype._addTrideroche_head = function (cpV){
	var mass = 50;
	var radius = 10;
	var body = new cp.Body(mass, cp.momentForCircle(mass, 0, radius, cp.v(0,0)));
	body.setPos(cpV);
	this.space.addBody(body);

	var shape = new cp.CircleShape(body, radius, cp.v(0,0));
	shape.setElasticity(0.1);
	shape.setFriction(0.8);
	shape.group = COLLISION_GROUP.TRIDEROCHE;
	this.space.addShape(shape);

	return body;
}
Trideroche.prototype._addTrideroche_body = function (cpV) {
	var mass = 2;
	var width = 5;
	var height = 20;

	var body = new cp.Body(mass, cp.momentForBox(mass, width, height));
	body.setPos(cpV);
	this.space.addBody(body);

	var shape = new cp.BoxShape(body, width, height);
	shape.setElasticity(0);
	shape.setFriction(0.4);
	shape.group = COLLISION_GROUP.TRIDEROCHE;
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
	shape.group = COLLISION_GROUP.TRIDEROCHE;
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
	shape.group = COLLISION_GROUP.TRIDEROCHE;
	this.space.addShape(shape);

	return body;
}
Trideroche.prototype._addFoot = function(cpV) {
	var mass = 200;
	var width = 1;
	var height = 0.5;

	var body = new cp.Body(mass, cp.momentForBox(mass, width, height));
	body.setPos(cpV);
	this.space.addBody(body);

	var shape = new cp.BoxShape(body, width, height);
	shape.setElasticity(0);
	shape.setFriction(0.2);
	shape.group = COLLISION_GROUP.TRIDEROCHE;
	this.space.addShape(shape);

	return body;
}
Trideroche.prototype.maintainHead = function() {
	this.head.setVel(cp.v(0,200));
}


