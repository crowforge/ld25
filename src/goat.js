var GoatState = {
	NORMAL_STATE:1,
	SHAKE_STATE:2,
	PALED_STATE:3,
}

var Goat = CPSprite.extend({
	_normalAnimAction:null,
	_shakeAnimAction:null,
	_paledAnimAction:null,

	currentState:GoatState.NORMAL_STATE,

	initBoxShapeWithSpace:function (space, mass, location, frameName) {
		if(!this._super(space, mass, location, frameName))
		{
			global.log("Goat's initBoxShapeWithSpace() error.");
			return false;
		}

		// init data
		this.currentState = GoatState.NORMAL_STATE;
		this.shape.setCollisionType(COLLISION_GROUP.GOAT);

		// set up animations
		var frames = new Array();
		for(var i=0; i<4; i++)
		{
			frames.push(global.getSpriteFrame("main_char_walk" + (i+1) + ".png"));
		}
		var animate = cc.Animate.create(cc.Animation.create(frames, 1/7.0));
		this._normalAnimAction = cc.RepeatForever.create(animate);

		this.playNormalAnimation();

		return true;
	},
	playNormalAnimation:function() {
		this.currentState = GoatState.NORMAL_STATE;
		this.runAction(this._normalAnimAction);
	},
	playShakeAnimation:function() {

	},
	playPaledAnimation:function() {

	},
	destroy:function () {
		this._super();
	}
});

Goat.create = function(space, location) {
	var sprite = new Goat();
	if(sprite && sprite.initBoxShapeWithSpace(space, 3, location, "main_char_walk1.png"))
	{
		return sprite;
	}
	else
	{
		sprite = null;
		return null;
	}
}