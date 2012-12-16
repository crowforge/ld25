var COLLISION_GROUP = {
	TRIDEROCHE:1,
}

var GameplayLayer = cc.LayerColor.extend({
	space:null,

	// flags & info
	isGameOver:false,

	// objects
	trideroche:null,

	_debugNode:null,
	_humanBatchNode:null,

	init:function(color) {
		if(!this._super(color))
		{
			global.log("GameplayLayer's init() called failed.");
			return false;
		}

		var winSize = cc.Director.getInstance().getWinSize();

		// init the less
		this.isGameOver = false;

		this._humanBatchNode = cc.SpriteBatchNode.create(res_humanSpriteSheet);
		this.addChild(this._humanBatchNode);

		// create chipmunk space
		this.setupPhysics();
		this.setupPhysicsDebugNode();

		// create trideroche & add into the physics and scene
		this.trideroche = new Trideroche(this.space, this, cc.p(winSize.width/2, winSize.height/2.5));

		// enable mouse and keyboard
		this.setMouseEnabled(true);
		this.setKeyboardEnabled(true);
		// create an update function
		this.scheduleUpdate();

		// schedule to maintain the head level of triceroche
		this.schedule(this._maintainTriderocheHead, 0.4);

		return true;
	},
	// set up chipmunk space
	setupPhysics:function() {
		this.space = new cp.Space();
		this.space.gravity = cp.v(0, -200);
		this.space.iterations = 30;
		this.space.sleepTimeThreshold = 0.5;

		// add ground
		var winSize = cc.Director.getInstance().getWinSize();
		var staticBody = this.space.staticBody;
		var ground = new cp.SegmentShape(staticBody, cp.v(0,10), cp.v(winSize.width,10), 2);
		ground.setElasticity(1);
		ground.setFriction(1);
		ground.shape = 10;
		this.space.addStaticShape(ground);
	},
	setupPhysicsDebugNode:function () {
		this._debugNode = cc.PhysicsDebugNode.create(this.space);
		this._debugNode.setVisible(true);
		this.addChild(this._debugNode);
	},
	addBox:function (p) {
		var space = this.space;

		var width = 50;
		var height = 50;
		var mass = width * height * 1/1000;
		var box = new cp.Body(mass, cp.momentForBox(mass, width, height));
		box.setPos(cp.v(p.x, p.y));
		space.addBody(box);

		var shape = new cp.BoxShape(box, width, height);
		shape.setFriction(0.3);
		shape.setElasticity(0.3);
		space.addShape(shape);
	},
	addCatBox:function (p) {
		var verts = [
		    41.5/2, 67.5/2,
		    33.5/2, -71.5/2,
		    -50.5/2, -71.5/2,
		    -31.5/2, 72.5/2
		];
		var cat = CPSprite.createWithPolyShape(this.space, 1.0, p, verts, "cat_sleepy.png");
		this._humanBatchNode.addChild(cat);
	},
	addCar:function (p) {
		var pos = cp.v(p.x, p.y);

		var wheel1 = this._addWheel_forCar(cp.v.add(cp.v(15,-20), pos));
		var wheel2 = this._addWheel_forCar(cp.v.add(cp.v(65,-20), pos));
		var chassis = this._addChassis_forCar(cp.v.add(cp.v(40, 15), pos));

		// relative constraint
		this.space.addConstraint(new cp.GrooveJoint(chassis, wheel1, cp.v(-25,-10), cp.v(-25,-50), cp.v(0,0)));
		this.space.addConstraint(new cp.GrooveJoint(chassis, wheel2, cp.v( 25,-10), cp.v( 25,-50), cp.v(0,0)));

		this.space.addConstraint(new cp.DampedSpring(chassis, wheel1, cp.v(-25,0), cp.v(0,0), 50, 400, 20));
		this.space.addConstraint(new cp.DampedSpring(chassis, wheel2, cp.v(25,0), cp.v(0,0), 50, 400, 20));
	},
	_addWheel_forCar:function (cpV) {
		var radius = 15;
		var mass = 1;
		var body = new cp.Body(mass, cp.momentForCircle(mass, 0, radius, cp.v(0,0)));
		body.setPos(cpV);
		this.space.addBody(body);

		var shape = new cp.CircleShape(body, radius, cp.v(0,0));
		shape.setElasticity(0);
		shape.setFriction(0.7);
		//shape.group = 1;
		this.space.addShape(shape);

		return body;
	},
	_addChassis_forCar:function (cpV) {
		var space = this.space;

		var mass = 5;
		var width = 80;
		var height = 30;

		var body = new cp.Body(mass, cp.momentForBox(mass, width, height));
		body.setPos(cpV);
		this.space.addBody(body);

		var shape = new cp.BoxShape(body, width, height);
		shape.setElasticity(0);
		shape.setFriction(0.7);
		//shape.group = 1;
		this.space.addShape(shape);

		return body;
	},
	update:function (dt) {
		// update chipmunk physics
		this.space.step(dt);

		if(!this.isGameOver)
		{
			//this.trideroche.resetForces();
			this.trideroche.update();
		}

		// Sprites node
		// update all human sprites
		var children = this._humanBatchNode.getChildren();
		for(var i=0; i<children.length; i++)
		{
			var node = children[i];
			node.update();
		}
	},
	// -- keyboard
	onKeyUp:function (e) {

	},
	onKeyDown:function (e) {
		if(!this.isGameOver)
		{
			if(e == cc.KEY.w)
			{
				var winSize = cc.Director.getInstance().getWinSize();
				this.addCatBox(cc.p(winSize.width/2, winSize.height/2));
			}
			// restart game
			/*if(e == cc.KEY.r)
			{
				this.restartGame();
			}*/

			// update trideroche key control
			this.trideroche.onKeyDown(e);
		}
	},
	// -- mouse
	onMouseEntered:function (e) {
		return true;
	},
	onMouseMoved:function (e) {
		return true;
	},
	onMouseDragged:function (e) {
		return true;
	},
	onMouseDown: function (e) {
		return true;
	},
	onEnter:function () {
		this._super();
		global.loadSpriteFrames(res_humanSpriteSheetPlist);
	},
	onExit:function () {
		this._super();
		global.unloadSpriteFrames(res_humanSpriteSheetPlist);

		this.unscheduleUpdate();
	},
	restartGame:function () {
		// reset states
		this.isGameOver = false;

		// TODO: remove all objects here

		// re-init
		this.init(cc.c4b(0,0,0,0));
	},
	_maintainTriderocheHead:function (dt) {
		this.trideroche.maintainHead();
		global.log("called to maintain trideroche's head.");
	}
});

var GameplayScene = cc.Scene.extend({
	onEnter:function() {
		this._super();

		var layer = new GameplayLayer();
        layer.init(cc.c4b(0,0,0,0));
        this.addChild(layer);
	}
});