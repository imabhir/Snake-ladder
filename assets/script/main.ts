import { _decorator,Animation, Component, Node, Prefab, instantiate, Label, UITransform, Sprite, color, Color, Button, SpriteFrame, CCInteger, AnimationClip, animation, AnimationComponent, spriteAssembler, Vec3, tween, JsonAsset } from 'cc';
const { ccclass, property } = _decorator;
// import postion from './Postion.json'

@ccclass('main')
export class main extends Component {
    @property({type:Prefab})
    box:Prefab=null;
    @property({type:Prefab})
    snake:Prefab=null;
    @property({type:Prefab})
    ladder:Prefab=null;
    @property({type:JsonAsset})
    position2:JsonAsset=null;
    @property({type:Label})
    label:Label=null;
    @property({type:AnimationClip})
    diceRollAnim:AnimationClip=null;
    @property({type:SpriteFrame})
    dicePhoto:SpriteFrame[]=[];
    map:Map<number,Vec3>=null;
    playerTileNumber:number=0;
    boy:Node=null;
    callback:boolean=true;
    snakePos:any=[];
    ladderPos:any=[];
    endSnakePos:any=[];
    endLadderPos:any=[];
    endPosIndex:number=0;
    random:number=0;
    position:any=null;
    flag:boolean=false;
    j:number=0;
    start() {
        this.position=this.position2.json;
        this.map=new Map();
        this.snakePos=new Array();
        this.position.Snake.Start[0]
        this.boxPrint();
        
        this.node.getChildByName('baby0').setSiblingIndex(this.node.children.length);
        
    }
    playerMove() {
        var player=this.node.getChildByName('baby0')
        if(this.playerTileNumber+this.random==100 || this.playerTileNumber+this.random<100){
            // for(var i=this.playerTileNumber;i<=this.playerTileNumber+this.random;i++){
            //     console.log(i);
            //     let j=i;
                
            //     this.scheduleOnce(()=>{
            //         console.log(j,"sch");
                    
            //         tween(player)
            //     .to(5, { position:new Vec3 (this.map.get(j))})
            //     .call(() => {
            //     })
            //     .start();
            //     },0.1*this.random);
                
            // }
            
            this.playerTileNumber+=this.random;
            player.setPosition(this.map.get(this.playerTileNumber));
            if(this.playerTileNumber==100){
                console.log("win");
                
            }
        }else{
            console.log("out of board");
        }
        
        
        for(var i=0;i<3;i++){
           if(this.playerTileNumber==this.position.Ladder.Start[i]){ /// add loop to check all ocuurence
                let boxNumber=this.position.Ladder.End[i];

                    player.setPosition(this.map.get(boxNumber));
                    this.playerTileNumber=boxNumber;
                } 
        }
        for(var i=0;i<3;i++){
            if(this.playerTileNumber==this.position.Snake.End[i]){ /// add loop to check all ocuurence
            let boxNumber=this.position.Snake.Start[i];
                player.setPosition(this.map.get(boxNumber));
                this.playerTileNumber=boxNumber;
            } 
    }
    console.log(this.playerTileNumber);
    
    }
    
    boxPrint(){

        let box=instantiate(this.box);
        let lastPos=box.getPosition();
        let boolCheck=false;
        let snakeIndex=0;
        let ladderIndex=0;
        for(var i=1;i<=100;i++){
            let box=instantiate(this.box);
            var child=box.getChildByName('box').getChildByName('boxNo');
            child.getComponent(Label).string=`${i}`;
            if(i%2==0){
                box.getChildByName('box').getComponent(Sprite).color=Color.RED
            }
            if(boolCheck){
                box.setPosition(lastPos.x,lastPos.y,lastPos.z);
                lastPos.x=lastPos.x-box.getComponent(UITransform).width-10;
                this.node.addChild(box);
                if(i%10==0){
                    lastPos.y=lastPos.y+box.getComponent(UITransform).height+10;
                    boolCheck=false;
                }
            }else{
                lastPos.x=lastPos.x+box.getComponent(UITransform).width+10;
                box.setPosition(lastPos.x,lastPos.y,lastPos.z);
                this.node.addChild(box);
                if(i%10==0){
                    lastPos.y=lastPos.y+box.getComponent(UITransform).height+10;
                    boolCheck=true;
                }
            }if(i==this.position.Snake.End[snakeIndex]){
                let snake=instantiate(this.snake);
                this.node.addChild(snake);
                let boxEndPos=box.getPosition();
                let boxStartPos=this.map.get(this.position.Snake.Start[snakeIndex]);
                let dy=boxEndPos.y-boxStartPos.y;
                let dx=boxEndPos.x-boxStartPos.x;
                let midX=(boxEndPos.x+boxStartPos.x)/2;
                let midY=(boxEndPos.y+boxStartPos.y)/2
                var angleRad = Math.atan2(dy,dx);
                var angleDeg = angleRad * 180 / Math.PI;let postion=box.getPosition();
                let scaleX=dx/snake.getComponent(UITransform).width;
                let scaleY=dy/snake.getComponent(UITransform).height;
                
                snake.angle=90+angleDeg;
                snake.setScale(1,scaleY,0);
                snake.setPosition(midX,midY,0);
                snakeIndex=snakeIndex+1;
            }if(i==this.position.Ladder.End[ladderIndex]){
                let ladder=instantiate(this.ladder);
                this.node.addChild(ladder);
                let boxEndPos=box.getPosition();
                let boxStartPos=this.map.get(this.position.Ladder.Start[ladderIndex]);
                let dy2=Vec3.distance(boxEndPos,boxStartPos);
                console.log(dy2);
                
                let dy=boxEndPos.y-boxStartPos.y;
                let dx=boxEndPos.x-boxStartPos.x;
                let midX=(boxEndPos.x+boxStartPos.x)/2;
                let midY=(boxEndPos.y+boxStartPos.y)/2
                var angleRad = Math.atan2(dy,dx);
                var angleDeg = angleRad * 180 / Math.PI;
              console.log(ladder.getComponent(UITransform).height,dy,"  diffrence");
              
                let scaleY=dy2/ladder.getComponent(UITransform).height;
                console.log(dy,scaleY,"scale");
                
                ladder.angle=90+angleDeg;
                ladder.setScale(1,scaleY,0);
                ladder.setPosition(midX,midY,0);
                ladderIndex++;
            }
            // console.log(box.getPosition());
            this.map.set(i,box.getPosition());
        }
    }

    diceRoll(event:any){
        event.currentTarget.getComponent(Button).interactable=false;
        let buttonNode: Node = event.currentTarget;
        buttonNode.getComponent(Animation).on(
            Animation.EventType.FINISHED,
            () => {
                // console.log("animation finished")
                this.random=Math.floor(Math.random() * (6)) + 1;
                let buttonNode: Node = event.currentTarget;
                buttonNode.getComponent(Sprite).spriteFrame=this.dicePhoto[this.random-1];
                this.label.string=`${this.random}`;
                this.playerMove();
                event.currentTarget.getComponent(Button).interactable=true;
            },
            this,
            true
        );
        buttonNode.getComponent(Animation).play();
        }
    
    
    update(deltaTime: number) {
        
    }
}

