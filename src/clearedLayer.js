var ClearedLayer = cc.LayerColor.extend({
	timeRecordStr:-1,	// in secs

	initWithTimeRecord:function (color, timeRecordStr) {
		if(!this.init(color))
		{
			return false;
		}

		// save data
		this.timeRecordStr = timeRecordStr;

		// fade in backdrop
		var sequence = cc.Sequence.create(
			cc.FadeTo.create(1.0, 128),
			cc.CallFunc.create(this.showUIElements, this)
		);
		this.runAction(sequence);

		return true;
	},
	showUIElements:function() {
		var winSize = cc.Director.getInstance().getWinSize();

		// labels
		var youDieLabel = cc.LabelTTF.create("Stage Cleared!", "AtariClassic", 40);
		youDieLabel.setColor(cc.c3b(255,0,0));
		youDieLabel.setPosition(
			cc.p(winSize.width/2,
				 winSize.height/1.5 - youDieLabel.getContentSize().height/2)
			);
		this.addChild(youDieLabel);

		var waveLabel = cc.LabelTTF.create("Time Record: " + this.timeRecordStr, "AtariClassic", 18);
		waveLabel.setColor(cc.c3b(255,255,255));
		waveLabel.setPosition(
			cc.p(
				winSize.width/2,
				youDieLabel.getPositionY() - youDieLabel.getContentSize().height/2 - 20 - waveLabel.getContentSize().height/2)
			);
		this.addChild(waveLabel);

		var restartGameLabel = cc.LabelTTF.create("Press x to continue", "AtariClassic", 20);
		restartGameLabel.setColor(cc.c3b(255,255,255));
		restartGameLabel.setPosition(
			cc.p(
				winSize.width/2, 
				winSize.height/4.5));
		var blink = cc.Blink.create(2.0, 3);
		var forever = cc.RepeatForever.create(blink);
		restartGameLabel.runAction(forever);
		this.addChild(restartGameLabel);

		this.setKeyboardEnabled(true);

		var menu = cc.Menu.create()
	},
	onKeyUp:function (e) {
		// nothing here
	},
	onKeyDown:function (e) {
		if(e == cc.KEY.x)
		{
			if(profile.selectedLevel > LevelSetting.TOTAL_LEVEL)
			{
				// set selected level back to 1
				profile.selectedLevel = 1;

				// go back to main menu
				cc.Director.getInstance().replaceScene(new MainMenuScene());
			}
			else
			{
				// play next game (the level is already updated)
				this.getParent().restartGame();
			}
		}
	}
});

ClearedLayer.create = function(timeRecordStr) {
	var layer = new ClearedLayer();
	if(layer && layer.initWithTimeRecord(cc.c4b(30, 30, 30, 30), timeRecordStr))
	{
		return layer;
	}
	else
	{
		layer = null;
		return null;
	}
}