var HUDLayer = cc.LayerColor.extend({
	timeRecordLabel:null,

	init:function (color) {
		if(!this._super(color))
		{
			return false;
		}

		var winSize = cc.Director.getInstance().getWinSize();

		// add time record label
		this.timeRecordLabel = cc.LabelTTF.create("Time 00:00", "AtariClassic", 18);
		this.timeRecordLabel.setPosition(cc.p(winSize.width - this.timeRecordLabel.getContentSize().width, winSize.height-20));
		this.timeRecordLabel.setColor(cc.c3b(255,255,255));
		this.ignoreAnchorPointForPosition(true);
		this.addChild(this.timeRecordLabel);

		this.scheduleUpdate();

		return true;
	},
	update:function (dt) {
		// update label string
		this.timeRecordLabel.setString("Time " + this.getParent().timeRecord);
	}
});

HUDLayer.create = function() {
	var layer = new HUDLayer();
	if(layer && layer.init(cc.c4b(0, 0, 0, 0)))
	{
		return layer;
	}
	else
	{
		layer = null;
		return null;
	}
}