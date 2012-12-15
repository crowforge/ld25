var PTM_RATIO = 32;

var GameplayLayer = cc.LayerColor.extend({
	_world:null,

	init:function(color) {
		if(!this._super(color))
		{
			global.log("GameplayLayer's init() called failed.");
			return false;
		}

		var winSize = cc.Director.getInstance().getWinSize();

		// create a box2d world
		var b2Vec2 = Box2D.Common.Math.b2Vec2;
		var b2BodyDef = Box2D.Dynamics.b2BodyDef;
		var b2Body = Box2D.Dynamics.b2Body;
		var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
		var b2World = Box2D.Dynamics.b2World;
		var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
		var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

		this._world = new b2World(new b2Vec2(0, -10), true);
		this._world.SetContinuousPhysics(true);

		// create ground
		var groundFixDef = new b2FixtureDef();
		groundFixDef.density = 1.0;
		groundFixDef.friction = 0.5;
		groundFixDef.restitution = 0.2;

		var groundBodyDef = new b2BodyDef();
		groundBodyDef.type = b2Body.b2_staticBody;
		groundBodyDef.position.x = 2 / PTM_RATIO;
		groundBodyDef.position.y = winSize.height / 2.5 / PTM_RATIO;

		groundFixDef.shape = new b2PolygonShape();
		groundFixDef.shape.SetAsBox(winSize.width/PTM_RATIO/2.5, 10/PTM_RATIO/2);

		this._world.CreateBody(groundBodyDef).CreateFixture(groundFixDef);

		// set up debug draw
		var debugDraw = new b2DebugDraw();
		debugDraw.SetSprite(cc.renderContext);
		debugDraw.SetDrawScale(PTM_RATIO);
		debugDraw.SetFillAlpha(0.3);
		debugDraw.SetLineThickness(1.0);
		debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit | b2DebugDraw.e_centerOfMassBit);
		this._world.SetDebugDraw(debugDraw);

		// create an update function
		this.scheduleUpdate();

		return true;
	},
	update:function (dt) {
		this._world.Step(1/60, 10, 10);
		this._world.ClearForces();
	},
	draw:function (ctx) {
		this._super(ctx);
		this._world.DrawDebugData();
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