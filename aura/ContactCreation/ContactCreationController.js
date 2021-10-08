({
    populateOptions : function(component,event,helper){
        var action = component.get("c.getStatusValues");
        action.setCallback(this,function(response){
           var state = response.getState();
            if(state==="SUCCESS"){
                component.set("v.options",response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
        
    },
    
    validateContactFields : function(component,event,helper){
        var contactFields = component.find("formFieldToValidate");
        if(contactFields.length!=undefined){
            var allValid = contactFields.reduce(function(validSoFar,inputCmp){
                inputCmp.showHelpMessageIfInvalid();
                var name=inputCmp.get('v.name');
                if(name=='emailField'){
                    var emailFieldValue =inputCmp.get("v.value");
                    // check if Email field in not blank,
                    // and if Email field value is valid then set error message to null, 
                    // and remove error CSS class.
                    // ELSE if Email field value is invalid then add Error Style Css Class.
                    // and set the error Message.  
                    // and set isValidEmail boolean flag value to false.
                    var regExpEmailformat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    if(!$A.util.isEmpty(emailFieldValue)){
                        
                        if(!(emailFieldValue.match(regExpEmailformat))){
                            inputCmp.focus();
                            inputCmp.set('v.validity',{valid: false, badInput: true});
                            inputCmp.showHelpMessageIfInvalid();
                       }
                    }
                }
                return validSoFar && inputCmp.get('v.validity').valid;
            }, true );
        }
        return allValid;
    },
    
	saveContactRecord : function(component, event, helper) {
        var isContactValid = component.validateContact(component, event, helper);
        if(isContactValid && component.get("v.selectedLookUpRecord").Id != undefined){
            component.set("v.lookupNull",false);
            helper.saveContactHelper(component, event, helper);
        }
        else{
            var getSelectedValue = component.find("getSelecteValue");
            component.set("v.lookupNull",true);
            getSelectedValue.getSelectedLookupValue();
        }
    },
    
    handleChange: function (component, event) {
        // This will contain the string of the "value" attribute of the selected option
        //var selectedOptionValue = event.getParam("value");
        var conObj = component.get("v.objContact");
        conObj.Status__c=component.get("v.selOption");
        component.set("v.objContact",conObj);
    },
    
    replaceRecords:function(component,event){
        var actId = event.getParam("AccountId");
        var action = component.get("c.getObject");
        action.setParams({
            'AccountId': actId
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var getSelectedValue = component.find("getSelecteValue");
                component.set("v.selectedLookUpRecord",response.getReturnValue())
                getSelectedValue.getSelectedLookupValue();
            }
        });
        $A.enqueueAction(action);
        
        component.set("v.objContact.AccountId",actId);
        component.set("v.objContact.Id",event.getParam("Id"));
        component.set("v.objContact.FirstName",event.getParam("FirstName"));
        component.set("v.objContact.LastName",event.getParam("LastName"));
        component.set("v.objContact.Email",event.getParam("Email"));
        component.set("v.selOption",event.getParam("Status"));
        
        var conObj = component.get("v.objContact");
        conObj.Status__c=component.get("v.selOption");
        component.set("v.objContact",conObj);
    }
})