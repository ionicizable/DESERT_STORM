class Sprite{
    constructor(url,pos,size,speed,frames,renderSize){
        this.url = url;
        this.pos = pos;
        this.size = size;
        this.speed = speed;
        this.frameIdx = 0;
        this.frames = frames;
        this.done=false;
        this.renderSize=renderSize;
    };

    update(td){
        if (!this.done) {
            this.frameIdx+=1;
        }
        if ( this.frameIdx==this.frames.length) {
            this.frameIdx = 0;
        }
    }

    updateExplosion(td){
        this.frameIdx+=1;
    }

    render(ctx,dir){
        switch (dir) {
            case 0:
            ctx.drawImage(resources.get(this.url),this.frames[this.frameIdx]*115,0*67,114,67,this.pos[0],this.pos[1],this.renderSize[0],this.renderSize[1]);
            this.setDone();
            break;
            case 1:
            ctx.drawImage(resources.get(this.url),this.frames[this.frameIdx]*115,1*67,114,67,this.pos[0],this.pos[1],this.renderSize[0],this.renderSize[1]);
            this.setDone();
            break;
            case 2:
            ctx.drawImage(resources.get(this.url),this.frames[this.frameIdx]*115,3*67,114,67,this.pos[0],this.pos[1],this.renderSize[0],this.renderSize[1]);
            this.setDone();
            break;
            case 3:
            ctx.drawImage(resources.get(this.url),this.frames[this.frameIdx]*115,2*67,114,67,this.pos[0],this.pos[1],this.renderSize[0],this.renderSize[1]);
            break;
        }
    }

    renderBg(ctx,td){
        ctx.drawImage(resources.get('img/bg.jpg'),this.pos[0],0,1000,500,0,0,1000,500);
        this.pos[0]+=this.speed*td;
        if (this.pos[0]>=1000) {this.pos[0]=0;}
    }

    renderEnemy(ctx,td){
        ctx.drawImage(resources.get(this.url),115*this.frames[this.frameIdx],2*67,115,67,this.pos[0],this.pos[1],this.renderSize[0],this.renderSize[1]);
        if (this.frameIdx==this.frames.length-1) {this.frameIdx=0;}
        this.pos[0]-=this.speed*td;
    }
    renderRocket(ctx,td){
        ctx.drawImage(resources.get(this.url),this.size[0]*this.frames[this.frameIdx],0,this.size[0],this.size[1],this.pos[0],this.pos[1],this.renderSize[0],this.renderSize[1]);
        if (this.frameIdx==this.frames.length-1) {this.frameIdx=0;}
        this.pos[0]+=this.speed*td;
    }
    renderExplosion(ctx){
        ctx.drawImage(resources.get(this.url),93*(this.frameIdx%9),(Math.floor(this.frameIdx/9))*93,93,87,this.pos[0]-this.renderSize[0]/2,this.pos[1]-this.renderSize[1]/2,this.renderSize[0],this.renderSize[1]);
    }
    isEnded(){
        if (this.frameIdx==73) {return true;}
        return false;
    }

    setDone(){
        if (this.frameIdx==this.frames.length-1) {
            this.done=true;
        }
        else {
            this.done = false;
        }
    }
}

