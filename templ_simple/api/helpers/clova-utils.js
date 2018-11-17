'use strict';

class ClovaUtils{
    constructor(clova){
        this.clova = clova;
        this.clovaSkillHandler = clova.Client.configureSkill();
        this.launchHandle = null;
        this.sessionEndedHandle = null;
        this.intentHandles = new Map();

        this.clovaSkillHandler
        .onLaunchRequest(async responseHelper => {
            if( this.launchHandle )
                return this.launchHandle(responseHelper);
        })
        .onIntentRequest(responseHelper => {
            const intent = responseHelper.getIntentName();

            var handle = this.intentHandles.get(intent);
            if( handle )
                return handle(responseHelper);
        })
        .onSessionEndedRequest(responseHelper => {
            if( this.sessionEndedHandle )
                return this.sessionEndedHandle(responseHelper);
        });
    }

    intent( matcher, handle ){
        if( matcher == 'LaunchRequest')
            this.launchHandle = handle;
        else if( matcher == 'SessionEndedRequest')
            this.sessionEndedHandle = handle;
        else
            this.intentHandles.set(matcher, handle);
    }

    getAttributes( responseHelper ){
        return responseHelper.getSessionAttributes();
    }

    setAttributes( responseHelper, attributes){
        responseHelper.setSessionAttributes(attributes);
    }

    getSlots( responseHelper ){
        return responseHelper.getSlots();
    }

    handle(){
        return this.clovaSkillHandler.handle();
    }
};

module.exports = ClovaUtils;
