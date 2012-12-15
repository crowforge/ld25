var GameplayLayer = cc.LayerColor.extend({
	space:null,
	_debugNode:null,
	_humanBatchNode:null,

	init:function(color) {
		if(!this._super(color))
		{
			global.log("GameplayLayer's init() called failed.");
			return false;
		}

		// init the less
		this._humanBatchNode = cc.SpriteBatchNode.create(res_humanSpriteSheet);
		this.addChild(this._humanBatchNode);

		// create chipmunk space
		this.setupPhysics();
		this.setupPhysicsDebugNode();

		// enable mouse and keyboard
		this.setMouseEnabled(true);
		this.setKeyboardEnabled(true);
		// create an update function
		this.scheduleUpdate();

		return true;
	},
	// set up chipmunk space
	setupPhysics:function() {
		this.space = new cp.Space();
		this.space.gravity = cp.v(0, -700);
		this.space.iterations = 15;

		// add ground
		var winSize = cc.Director.getInstance().getWinSize();
		var staticBody = this.space.staticBody;
		var ground = new cp.SegmentShape(staticBody, cp.v(0,10), cp.v(winSize.width,10), 0);
		ground.setElasticity(1);
		ground.setFriction(1);
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
		var box = space.addBody(new cp.Body(mass, cp.momentForBox(mass, width, height)));
		box.setPos(cp.v(p.x, p.y));

		var shape = space.addShape(new cp.BoxShape(box, width, height));
		shape.setFriction(0.3);
		shape.setElasticity(0.3);
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
	update:function (dt) {
		this.space.step(dt);

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
		// check to remove a cat box first
		var shape = this.space.pointQueryFirst(cp.v(e.getLocation().x, e.getLocation().y), cp.ALL_LAYERS, 0);
		if(shape)
		{
			var spriteNode = shape.body.data;
			spriteNode.destroy();
		}
		else
			this.addCatBox(e.getLocation());
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