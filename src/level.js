// contains all levels in-game
// all positions are in clockwise
// warning: manually multiply with "numScreens" to x-pos if the level contains more than 1 chunk of screen
var LevelSetting = {
	BLOCK_HEIGHT: 80,
	SCREEN_WIDTH: 800,
	SCREEN_HEIGHT: 400,
	PADDING: 30,
	BLOCK_OFFSET: 20,
	NORMAL_HOLE_WIDTH: 50,
	BIG_HOLE_WIDTH: 100
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
			// - right side
			verts: [
				LevelSetting.SCREEN_WIDTH + LevelSetting.PADDING, 10,
				LevelSetting.SCREEN_WIDTH + LevelSetting.PADDING, 10-LevelSetting.BLOCK_HEIGHT,
				LevelSetting.SCREEN_WIDTH/2 + LevelSetting.NORMAL_HOLE_WIDTH/2, 10-LevelSetting.BLOCK_HEIGHT,
				LevelSetting.SCREEN_WIDTH/2 + LevelSetting.NORMAL_HOLE_WIDTH/2, 10
			]
		},
		{
			// level
			// - left side
			verts: [
				LevelSetting.SCREEN_WIDTH/2 - LevelSetting.NORMAL_HOLE_WIDTH/2, 10,
				LevelSetting.SCREEN_WIDTH/2 - LevelSetting.NORMAL_HOLE_WIDTH/2, 10-LevelSetting.BLOCK_HEIGHT,
				0 - LevelSetting.PADDING, 10-LevelSetting.BLOCK_HEIGHT,
				0 - LevelSetting.PADDING, 10
			]
		}
	]
},
// 3
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
			// 1st platform (fromt start til 2nd platform)
			verts: [
				250, 10,
				250, 10 - LevelSetting.BLOCK_HEIGHT,
				0 - LevelSetting.BLOCK_OFFSET, 10-LevelSetting.BLOCK_HEIGHT,
				0 - LevelSetting.BLOCK_OFFSET, 10,
			]
		},
		{
			// 2nd platform (width 100 at the center of the screen)
			verts: [
				LevelSetting.SCREEN_WIDTH/2 + 50, 10,
				LevelSetting.SCREEN_WIDTH/2 + 50, 10-LevelSetting.BLOCK_HEIGHT,
				LevelSetting.SCREEN_WIDTH/2 - 50, 10-LevelSetting.BLOCK_HEIGHT,
				LevelSetting.SCREEN_WIDTH/2 - 50, 10
			]
		},
		{
			// 3rd platform (last part til the end of the screen chunk)
			verts: [
				LevelSetting.SCREEN_WIDTH + LevelSetting.BLOCK_OFFSET, 10,
				LevelSetting.SCREEN_WIDTH + LevelSetting.BLOCK_OFFSET, 10-LevelSetting.BLOCK_HEIGHT,
				LevelSetting.SCREEN_WIDTH - 250, 10-LevelSetting.BLOCK_HEIGHT,
				LevelSetting.SCREEN_WIDTH - 250, 10
			]
		}
	]
}
];