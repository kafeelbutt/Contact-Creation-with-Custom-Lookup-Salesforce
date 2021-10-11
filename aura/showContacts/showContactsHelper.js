({  
    pullData:function(component,helper){
        component.set("v.isLoading", true);
        var action=component.get("c.getContactData");       
        action.setCallback(this,function(e){
            component.set("v.isLoading", false);
            if(e.getState()=='SUCCESS'){
                var results=e.getReturnValue();
                if(results.length>0){
                    component.set('v.results', results);
                }
                else{
                    component.set('v.results', []);
                }
            }
            else{
                this.showToast("ERROR","error",JSON.stringify(e.getError()));
            }
        });
        $A.enqueueAction(action);
    },
    editRecord : function(component, event,helper) {
        var row = event.getParam('row');
        var actId = row.AccountId;
        var recordId = row.Id;
        var FirstName = row.FirstName;
        var LastName = row.LastName;
        var Email = row.Email;
        var Status = row.Status__c;
        var appEvent = $A.get("e.c:SendEditRecords");               
        
        appEvent.setParams({"Id":recordId,"FirstName":FirstName,"LastName":LastName,"Email":Email,"Status":Status,"AccountId":actId});                                               
        appEvent.fire();
        //$A.get("e.force:editRecord").setParams({"recordId": recordId}).fire();
    },
    deleteRecord : function(component, event, helper) {
        component.set("v.isLoading", true);
        var action = event.getParam('action');
        var contactRec = event.getParam('row');
        var modalFooter;
        $A.createComponents([
            ["c:deleteModalComponent",{}]
        ], function(components,status){
            if(status==="SUCCESS"){
                modalFooter = components[0];
                modalFooter.set("v.objContact.Id",contactRec.Id);
                modalFooter.find('modalLib').showCustomModal({
                    header:"Delete Contact",
                    body:"Are you sure want to delete this Contact?",
                    footer:modalFooter,
                    howCloseButton: true,
                    cssClass: "my-modal,my-custom-class,my-other-class",
                    closeCallback:function(){
                        component.set("v.isLoading", false);
                        helper.pullData(component,helper);
                        //var rows = component.get('v.results');
                        //var rowIndex = rows.indexOf(contactRec);
                        //rows.splice(rowIndex, 1);
                        //component.set('v.results', rows);
                        }
                });
            }
        });   
    },
    
    showToast:function(title,type,message){
        var toastEvent = $A.get("e.force:showToast");
        if(toastEvent){
            toastEvent.setParams({"title": title,"type": type,"message": message}).fire();
        }
        else{
            alert(message);
        }
    }
 })