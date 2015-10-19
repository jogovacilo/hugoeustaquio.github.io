/**
   Copyright (c) 2015 Belahcen Marwane (b.marwane@gmail.com)

   Permission is hereby granted, free of charge, to any person obtaining a copy
   of this software and associated documentation files (the "Software"), to deal
   in the Software without restriction, including without limitation the rights
   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   copies of the Software, and to permit persons to whom the Software is
   furnished to do so, subject to the following conditions:

   The above copyright notice and this permission notice shall be included in all
   copies or substantial portions of the Software.

   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   SOFTWARE.
 */

function mergeObjetcs(t,i){for(var e in i)try{t[e]=i[e].constructor==Object?mergeObjetcs(t[e],i[e]):i[e]}catch(h){t[e]=i[e]}return t}var HealthBar=function(t,i){this.game=t,this.setupConfiguration(i),this.setPosition(this.config.x,this.config.y),this.drawBackground(),this.drawHealthBar()};HealthBar.prototype.constructor=HealthBar,HealthBar.prototype.setupConfiguration=function(t){this.config=this.mergeWithDefaultConfiguration(t),this.flipped=this.config.flipped},HealthBar.prototype.mergeWithDefaultConfiguration=function(t){var i={width:250,height:40,x:0,y:0,bg:{color:"#651828"},bar:{color:"#FEFF03"},animationDuration:200,flipped:!1};return mergeObjetcs(i,t)},HealthBar.prototype.drawBackground=function(){var t=this.game.add.bitmapData(this.config.width,this.config.height);t.ctx.fillStyle=this.config.bg.color,t.ctx.beginPath(),t.ctx.rect(0,0,this.config.width,this.config.height),t.ctx.fill(),this.bgSprite=this.game.add.sprite(this.x,this.y,t),this.bgSprite.anchor.set(.5),this.flipped&&(this.bgSprite.scale.x=-1)},HealthBar.prototype.drawHealthBar=function(){var t=this.game.add.bitmapData(this.config.width,this.config.height);t.ctx.fillStyle=this.config.bar.color,t.ctx.beginPath(),t.ctx.rect(0,0,this.config.width,this.config.height),t.ctx.fill(),this.barSprite=this.game.add.sprite(this.x-this.bgSprite.width/2,this.y,t),this.barSprite.anchor.y=.5,this.flipped&&(this.barSprite.scale.x=-1)},HealthBar.prototype.setPosition=function(t,i){this.x=t,this.y=i,void 0!==this.bgSprite&void 0!==this.barSprite&&(this.bgSprite.position.x=t,this.bgSprite.position.y=i,this.barSprite.position.x=t-this.config.width/2,this.barSprite.position.y=i)},HealthBar.prototype.setPercent=function(t){0>t&&(t=0),t>100&&(t=100);var i=t*this.config.width/100;this.setWidth(i)},HealthBar.prototype.setWidth=function(t){this.flipped&&(t=-1*t),this.game.add.tween(this.barSprite).to({width:t},this.config.animationDuration,Phaser.Easing.Linear.None,!0)};