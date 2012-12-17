// contains all levels in-game
// all positions are in clockwise
var LevelSetting = {
	BLOCK_HEIGHT: 80,
	SCREEN_WIDTH: 800,
	SCREEN_HEIGHT: 400,
	PADDING: 30,
	BLOCK_OFFSET: 20
}

levels = [
// 1
{
	numScreens: 1,
	grounds: [
		{
			// left blocker (off-screen)
			verts: [
				-LevelSetting.BLOCK_OFFSET, LevelSetting.SCREEN_HEIGHT,
				-LevelSetting.BLOCK_OFFSET, 10,
				-LevelSetting.PADDING, 10,
				-LevelSetting.PADDING, LevelSetting.SCREEN_HEIGHT
			]
		},
		{
			// right blocker (off-screen)
			verts: [
				LevelSetting.SCREEN_WIDTH + LevelSetting.BLOCK_OFFSET, LevelSetting.SCREEN_HEIGHT,
				LevelSetting.SCREEN_WIDTH + LevelSetting.PADDING, LevelSetting.SCREEN_HEIGHT,
				LevelSetting.SCREEN_WIDTH + LevelSetting.PADDING, 10,
				LevelSetting.SCREEN_WIDTH + LevelSetting.BLOCK_OFFSET, 10
			]
		},
		{
			// level
			verts: [
				LevelSetting.SCREEN_WIDTH + LevelSetting.PADDING, 10,
				LevelSetting.SCREEN_WIDTH + LevelSetting.PADDING, 10-LevelSetting.BLOCK_HEIGHT,
				0 - LevelSetting.PADDING, 10-LevelSetting.BLOCK_HEIGHT,
				0 - LevelSetting.PADDING, 10
			]
		}
	]
},
// 2
{
	verts: [

	]
},
// 3
{
	verts: [

	]
}
];