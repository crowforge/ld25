// Chipmunk Sprite
var CPSprite = cc.Sprite.extend({
	body:null,
	shape:null,
	space:null,

	initBoxShapeWithSpace:function (space, mass, location, frameName) {
		if(!this.initWithSpriteFrameName(frameName))
		{
			global.log("CPSprite's initWithSpace() error.");
			return false;
		}

		this.space = space;
		this._createBodyBoxAtLocation(mass, location);

		return true;
	},
	initPolyShapeWithSpace:function (space, mass, location, verts, frameName) {
		if(!this.initWithSpriteFrameName(frameName))
		{
			global.log("CPSprite's initPolyShapeWithSpace() error.");
			return false;
		}

		this.space = space;
		this._createBodyPolyAtLocation(mass, location, verts);

		return true;
	},
	// this is not the same as normal update(dt)
	update:function () {
		this.setPosition(cc.p(this.body.p.x, this.body.p.y));
		this.setRotation(cc.RADIANS_TO_DEGREES(-1 * this.body.a));
	},
	destroy:function () {
		this.space.removeBody(this.body);
		this.space.removeShape(this.shape);
		this.removeFromParent(true);
	},

	// factory function to create CPSprite
	_createBodyBoxAtLocation:function (mass, location) {
		this.body = new cp.Body(mass, cp.momentForBox(mass, this.getContentSize().width, this.getContentSize().height));
		this.body.setPos(cp.v(location.x, location.y));
		this.body.data = this;
		this.space.addBody(this.body);

		this.shape = new cp.BoxShape(this.body, this.getContentSize().width, this.getContentSize().height);
		this.shape.setFriction(0.3);
		this.shape.setElasticity(0.5);
		this.space.addShape(this.shape);
	},
	_createBodyPolyAtLocation:function (mass, location, verts) {
		var moment = cp.momentForPoly(mass, verts, cp.v(0,0));

		this.body = new cp.Body(mass, moment);
		this.body.setPos(cp.v(location.x, location.y));
		this.body.data = this;
		this.space.addBody(this.body);

		this.shape = new cp.PolyShape(this.body, verts, cp.v(0,0));
		this.shape.setFriction(0.3);
		this.shape.setElasticity(0.5);
		this.space.addShape(this.shape);
	}
});

CPSprite.create = function(space, mass, location, frameName) {
	var cpSprite = new CPSprite();
	if(cpSprite && cpSprite.initBoxShapeWithSpace(space, mass, location, frameName))
	{
		return cpSprite;
	}
	else
	{
		cpSprite = null;
		return null;
	}
}

CPSprite.createWithPolyShape = function(space, mass, location, verts, frameName) {
	var cpSprite = new CPSprite();
	if(cpSprite && cpSprite.initPolyShapeWithSpace(space, mass, location, verts, frameName))
	{
		return cpSprite;
	}
	else
	{
		cpSprite = null;
		return null;
	}
}