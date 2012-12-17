var TriderocheSetting = {
	FOOT_STEP_COOLDOWN_TIME: 2, // in secs
	FOOT_UP_STEP_COOLDOWN_TIME: 3, // in secs
	HOLD_KEY_STEP: 10,	// amount that increase each frame from holding key
	FOOT_UP_Y_MAX_LEVEL_1: 150,	// limitation on y-position
	THRESHOLD_LEG_CONSIDER_UP: 0.5 // in secs
}

function Trideroche (space, parentNode, pos) {
	this.space = space;
	this.parentNode = parentNode;

	// -- internal variables -- //
	// holding key
	this._frontFootHoldKeyCounting = 0;
	this._backFootHoldKeyCounting = 0;
	this._middleFootHoldKeyCounting = 0;
	//  forward step cool down
	this._frontFootCoolDownCounting = 0;
	this._backFootCoolDownCounting = 0;
	this._middleFootCoolDownCounting = 0;
	// up step cool down

	// forward step
	this._isFrontFootStartedStep = false;
	this._isBackFootStartedStep = false;
	this._isMiddleFootStartedStep = false;

	// to detect legs when they're up (with threshold duration)
	this._frontLegUpCountingTime = 0;
	this._backLegUpCountingTime = 0;
	this._middleLegUpCountingTime = 0;
	// flags to count time
	this._isFrontLegUpStartedToSeparate = false;
	this._isBackLegUpStartedToSeparate = false;
	this._isMiddleLegUpStartedToSeparate = false;
	// for convenience counting of legs that're up
	this._countLegsUp = 3;	// we will spawn it in the air

	// -- end of internal variables -- //

	// -- public members -- //
	this.currentFootUpLevel = 1;
	this.currentActiveFootUpYMax = TriderocheSetting.FOOT_UP_Y_MAX_LEVEL_1;

	this.isFrontLegUp = true;
	this.isBackLegUp = true;
	this.isMiddleLegUp = true;

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

	// -- end of public members -- //

	// create chipmunk objects
	this.addTrideroche(pos);
	// set up handlers
	this.setUpCollisionHandler();
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
	// note: use numberic to represent which foot is here.
	// 1 - front foot
	// 2 - back foot
	// 3 - middle foot
	this.frontFoot = this._addFoot(cp.v.add(cp.v(50,25), pos));
	this.frontFoot.data = 1;
	this.backFoot = this._addFoot(cp.v.add(cp.v(-50,25), pos));
	this.backFoot.data = 2;
	this.middleFoot = this._addFoot(cp.v.add(cp.v(25,30), pos));
	this.middleFoot.data = 3;

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
Trideroche.prototype.setUpCollisionHandler = function() {
	this.space.addCollisionHandler(COLLISION_GROUP.TRIDEROCHE_FOOT, COLLISION_GROUP.GROUND,
		null,
		null,
		this._footAndGroundPostCollisionHandler.bind(this),
		this._footAndGroundSeparateCollisionHandler.bind(this)
		);
}
Trideroche.prototype.update = function(dt) {
	// update position of labels
	this._frontLegLabel.setPosition(cc.p(this.frontFoot.getPos().x, this.frontFoot.getPos().y + 40));
	this._backLegLabel.setPosition(cc.p(this.backFoot.getPos().x, this.backFoot.getPos().y + 40));
	this._middleLegLabel.setPosition(cc.p(this.middleFoot.getPos().x, this.middleFoot.getPos().y + 40));

	// update cool down time | forward-step
	if(this._isFrontFootStartedStep)
	{
		this._frontFootCoolDownCounting += dt;
		if(this._frontFootCoolDownCounting >= TriderocheSetting.FOOT_STEP_COOLDOWN_TIME)
		{
			this._frontFootCoolDownCounting = 0;
			this._isFrontFootStartedStep = false;
		}
	}
	if(this._isBackFootStartedStep)
	{
		this._backFootCoolDownCounting += dt;
		if(this._backFootCoolDownCounting >= TriderocheSetting.FOOT_STEP_COOLDOWN_TIME)
		{
			this._backFootCoolDownCounting = 0;
			this._isBackFootStartedStep = false;
		}
	}
	if(this._isMiddleFootStartedStep)
	{
		this._middleFootCoolDownCounting += dt;
		if(this._middleFootCoolDownCounting >= TriderocheSetting.FOOT_STEP_COOLDOWN_TIME)
		{
			this._middleFootCoolDownCounting = 0;
			this._isMiddleFootStartedStep = false;
		}
	}

	// to detect legs when they are up
	if(this._isFrontLegUpStartedToSeparate)
	{
		this._frontLegUpCountingTime += dt;

		if(this._frontLegUpCountingTime >= TriderocheSetting.THRESHOLD_LEG_CONSIDER_UP)
		{
			this._frontLegUpCountingTime = 0;
			this._isFrontLegUpStartedToSeparate = false;

			this.isFrontLegUp = true;

			this._countLegsUp++;
		}
	}
	if(this._isBackLegUpStartedToSeparate)
	{
		this._backLegUpCountingTime += dt;

		if(this._backLegUpCountingTime >= TriderocheSetting.THRESHOLD_LEG_CONSIDER_UP)
		{
			this._backLegUpCountingTime = 0;
			this._isBackLegUpStartedToSeparate = false;

			this.isBackLegUp = true;

			this._countLegsUp++;
		}
	}
	if(this._isMiddleLegUpStartedToSeparate)
	{
		this._middleLegUpCountingTime += dt;

		if(this._middleLegUpCountingTime >= TriderocheSetting.THRESHOLD_LEG_CONSIDER_UP)
		{
			this._middleLegUpCountingTime = 0;
			this._isMiddleLegUpStartedToSeparate = false;

			this.isMiddleLegUp = true;

			this._countLegsUp++;
		}
	}
}
Trideroche.prototype.onKeyUp = function (e) {
	if(e == cc.KEY.q)
	{
		this._frontFootHoldKeyCounting = 0;
	}
	if(e == cc.KEY.w)
	{
		this._backFootHoldKeyCounting = 0;
	}
	if(e == cc.KEY.e)
	{
		this._middleFootHoldKeyCounting = 0;
	}
}
Trideroche.prototype.onKeyDown = function (e) {
	// Front foot - Forward
	if(e == cc.KEY.a && !this._isFrontFootStartedStep && this.isFrontLegUp)
	{
		var pos = this.frontFoot.getPos();
		this.frontFoot.setVel(cp.v(120,0));
		global.log("Front foot moved forward");

		this._isFrontFootStartedStep = true;
	}

	// Back foot - Forward
	if(e == cc.KEY.s && !this._isBackFootStartedStep && this.isBackLegUp)
	{
		var pos = this.backFoot.getPos();
		this.backFoot.setVel(cp.v(120,0));
		global.log("Back foot moved forward");

		this._isBackFootStartedStep = true;
	}
	// Middle foot - Forward
	if(e == cc.KEY.d && !this._isMiddleFootStartedStep && this.isMiddleLegUp)
	{
		var pos = this.middleFoot.getPos();
		this.middleFoot.setVel(cp.v(120,0));
		global.log("Middle foot moved forward");

		this._isMiddleFootStartedStep = true;
	}

	// Front foot - Backward
	if(e == cc.KEY.z && !this._isFrontFootStartedStep && this.isFrontLegUp)
	{
		var pos = this.frontFoot.getPos();
		this.frontFoot.setVel(cp.v(-120,0));
		global.log("Front foot moved backward");

		this._isFrontFootStartedStep = true;
	}
	// Back foot - Backward
	if(e == cc.KEY.x && !this._isBackFootStartedStep && this.isBackLegUp)
	{
		var pos = this.backFoot.getPos();
		this.backFoot.setVel(cp.v(-120,0));
		global.log("Back foot moved backward");

		this._isBackFootStartedStep = true;
	}
	// Middle foot - Backward
	if(e == cc.KEY.c && !this._isMiddleFootStartedStep && this.isMiddleLegUp)
	{
		var pos = this.middleFoot.getPos();
		this.middleFoot.setVel(cp.v(-120,0));
		global.log("Middle foot moved backward");

		this._isMiddleFootStartedStep = true;
	}

	// Front foot - Up
	if(e == cc.KEY.q && this.frontFoot.getPos().y <= this.currentActiveFootUpYMax && this._countLegsUp <= 1)
	{
		var pos = this.frontFoot.getPos();
		this.frontFoot.setVel(cp.v(0, 150+this._frontFootHoldKeyCounting));
		this._frontFootHoldKeyCounting += TriderocheSetting.HOLD_KEY_STEP;

		global.log("Front foot moved up [" + this._frontFootHoldKeyCounting + "]");
	}
	// Back foot - Up
	if(e == cc.KEY.w && this.backFoot.getPos().y <= this.currentActiveFootUpYMax && this._countLegsUp <= 1)
	{
		var pos = this.backFoot.getPos();
		this.backFoot.setVel(cp.v(0, 150+this._backFootHoldKeyCounting));
		this._backFootHoldKeyCounting += TriderocheSetting.HOLD_KEY_STEP;

		global.log("Back foot moved up [" + this._backFootHoldKeyCounting + "]");
	}
	// Middle foot - Up
	if(e == cc.KEY.e && this.middleFoot.getPos().y <= this.currentActiveFootUpYMax && this._countLegsUp <= 1)
	{
		var pos = this.backFoot.getPos();
		this.middleFoot.setVel(cp.v(0, 150+this._middleFootHoldKeyCounting));
		this._middleFootHoldKeyCounting += TriderocheSetting.HOLD_KEY_STEP;

		global.log("Middle foot moved up [" + this._middleFootHoldKeyCounting + "]");
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
	shape.setCollisionType(COLLISION_GROUP.TRIDEROCHE_FOOT);
	this.space.addShape(shape);

	return body;
}
Trideroche.prototype.maintainHead = function() {
	this.head.setVel(cp.v(0,200));
}
Trideroche.prototype._footAndGroundPostCollisionHandler = function(arbiter, space) {
	var shapes = arbiter.getShapes();
	var foot = shapes[0].body.data;
	
	if(foot == 1 && this.isFrontLegUp)
	{
		this.isFrontLegUp = false;
		this._isFrontLegUpStartedToSeparate = false;

		this._countLegsUp--;
	}
	else if(foot == 2 && this.isBackLegUp)
	{
		this.isBackLegUp = false;
		this._isBackLegUpStartedToSeparate = false;

		this._countLegsUp--;
	}
	else if(foot == 3 && this.isMiddleLegUp)
	{
		this.isMiddleLegUp = false;
		this._isMiddleLegUpStartedToSeparate = false;

		this._countLegsUp--;
	}
}
Trideroche.prototype._footAndGroundSeparateCollisionHandler = function(arbiter, space) {
	var shapes = arbiter.getShapes();
	var foot= shapes[0].body.data;

	if(foot == 1)
	{
		this._isFrontLegUpStartedToSeparate = true;
	}
	else if(foot == 2)
	{
		this._isBackLegUpStartedToSeparate = true;
	}
	else if(foot == 3)
	{
		this._isMiddleLegUpStartedToSeparate = true;
	}
}
// TODO: Add this stuff to completely destroy the object properly
Trideroche.prototype.destroy = function()
{
	// remove handlers
	this.space.removeCollisionHandler(COLLISION_GROUP.TRIDEROCHE, COLLISION_GROUP.GROUND);

	// remove constraints

	// remove shapes

	// remove bodies
}





