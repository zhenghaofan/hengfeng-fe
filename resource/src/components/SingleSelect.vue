<template>
	<div class="u-select" @click.stop>
		<div class="u-select-name" @click="isCollpased=!isCollpased">{{selectunit.name}}<i class="u-icon i-arr-b"><i class="i-arr-ra"></i><i class="i-arr-rb"></i></i>
		</div>
		<input type="hidden" v-model="selectedId" />
		<ul class="u-select-list" v-show="!isCollpased && selectunit.options.length > 0">
			<li @click="selectOpt(index)" v-for="(opt, index) in selectunit.options" :value="opt.id" :name="opt.name">
				{{opt.name}}
			</li>
		</ul>
	</div>
</template>

<script>
//TODO select的收起
import jquery from '../../static/libs/jquery-1.10.1/jquery-1.10.1.min.js'
jquery('body').on('click', function(e) {
	/*if (!jquery(e.target).hasClass('u-select')) {
		jquery('.u-select-list').hide();
	}	*/
});

export default {
	data: function() {
		return {
			isCollpased: true,
			selectedId: '',
			selectedName: '',
			selectedIndex: ''
		};
	},
	props: ['selectunit', 'index'],
	watch: {
		'selectunit': {
			handler: function() {
				for (var i in this.selectunit.options) {
					if (this.selectunit.options[i].isSelected) {
						this.selectOpt(i);
					}
				}
			},
			deep: true
		}
	},
	methods: {
		selectOpt: function(index) {
			var self = this,
				selList = self.selectunit.options;

			this.isCollpased = !this.isCollpased;
			this.selectunit.name = selList[index].name;
			this.selectedId = selList[index].id;

			this.selectedIndex && (selList[this.selectedIndex].isSelected = false);
			this.selectedIndex = index;

			this.$emit('selval-changed', {
				index: this.index,
				selIdx: index,
				[this.selectunit.searchId]: self.selectedId
			});

			//this.$emit('xd-changed', self.index);
		}
	},
	mounted: function() {
		var self = this;
	}
}
</script>

<style>
.u-select {
	box-sizing: border-box;
	width: 120px;
	display: inline-block;
	position: relative;
	font-size: .6rem;
	color: #232323;
	vertical-align: middle;
	z-index: 99;
}

.u-select-name {
	position: relative;
	height: 30px;
	line-height: 30px;
	background-color: #fff;
	border: 1px solid #ccc;
	border-radius: 5px;
	text-align: center;
	cursor: pointer;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}

.u-select-name .u-icon {
	position: absolute;
	right: 10px;
	top: 12px;
}

.u-select-list {
	position: absolute;
	top: 28px;
	left: 0;
	width: 120px;
	box-sizing: border-box;
	border: 1px solid #ccc;
	border-top-color: #f1f1f1;
	background-color: #fff;
	border-bottom-left-radius: 5px;
	border-bottom-right-radius: 5px;
	line-height: 30px;
	text-align: center;
}

.u-select-list li {
	padding: 0 15px;
	/*text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;*/
}

.u-select-list li:last-child {
	border-bottom-left-radius: 5px;
	border-bottom-right-radius: 5px;
}

.u-select-list li:hover {
	background-color: #00d487;
	color: #fff;
	cursor: pointer;
}
</style>
