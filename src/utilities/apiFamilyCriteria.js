const mongoose = require("mongoose");
class apiFamilyCriteria {
    constructor(familyCriteriaCommand, family,weight=0) {
      
      this.familyCriteriaCommand = familyCriteriaCommand;
      this.family = family;
      this.weight = weight;
    }
  
    IDP_WEIGHT() {
      if(this.familyCriteriaCommand.hasOwnProperty('IDP_WEIGHT'))
      {
          if(this.familyCriteriaCommand.IDP_WEIGHT.IDP_WEIGH==='YES')
              this.calculateWeightByIdp();
              
          if(this.familyCriteriaCommand.IDP_WEIGHT.DATE_Of_IDP !=='NONE')
          {
            this.calculateWeightByIdpDate();
          }
          
      }
      return this;
    }

    //============================================
    HOUSE_WEIGHT() {
     
      
      if(this.familyCriteriaCommand.hasOwnProperty('HOUSE_WEIGHT'))
      {
          if(this.familyCriteriaCommand.HOUSE_WEIGHT.HOUSE_WEIGHT==='YES')
              this.calculateWeightByHouse();
              
          
      }
      return this;
    }
    //============================================
    CAMP_WEIGHT() {
     
      
      if(this.familyCriteriaCommand.hasOwnProperty('CAMP_WEIGHT'))
      {
          if(this.familyCriteriaCommand.CAMP_WEIGHT.CAMP_WEIGHT==='YES')
              this.calculateWeightByCamp();
              
          
      }
      return this;
    }
     //============================================
     INDIVIDUAL_WEIGHT() {
     
      
      if(this.familyCriteriaCommand.hasOwnProperty('INDIVIDUAL_WEIGHT'))
      {
          if(this.familyCriteriaCommand.INDIVIDUAL_WEIGHT.INDIVIDUAL_WEIGHT==='YES')
              this.calculateWeightByIndividuals();
              
          
      }
      return this;
    }
       //============================================
       HELP_WEIGHT() {
     
      
        if(this.familyCriteriaCommand.hasOwnProperty('HELP_WEIGHT'))
        {
            if(this.familyCriteriaCommand.HELP_WEIGHT.HELP_WEIGHT==='YES')
                this.calculateWeightByHelps();
                
            
        }
        return this;
      }
  //============================================
        DISABILITY_WEIGHT() {
     
      
          if(this.familyCriteriaCommand.hasOwnProperty('DISABILITY_WEIGHT'))
          {
              if(this.familyCriteriaCommand.DISABILITY_WEIGHT.DISABILITY_WEIGHT==='YES')
                  this.calculateWeightByDisability();
                  
              
          }
          return this;
        }
    //============================================
    DISEASE_WEIGHT() {
     
      
      if(this.familyCriteriaCommand.hasOwnProperty('DISEASE_WEIGHT'))
      {
          if(this.familyCriteriaCommand.DISEASE_WEIGHT.DISEASE_WEIGHT==='YES')
              this.calculateWeightByDiseases();
              
          
      }
      return this;
    }

  
  //============================================
    calculateWeightByIdp=()=>{
      if(this.family.IDp)
         this.weight+=this.familyCriteriaCommand.IDP_WEIGHT.IDP_WEIGHT_VALUE;
    }

    calculateWeightByIdpDate=()=>{
      const dateOfIDp=this.family.dateOfIDp;
      let IDpMonths=this.dateDiffInMonths(dateOfIDp);

      switch (this.familyCriteriaCommand.IDP_WEIGHT.DATE_Of_IDP) {
        case 'DATE_Of_IDP_MONTH':
            if(IDpMonths>this.familyCriteriaCommand.IDP_WEIGHT.MIN_DATE_Of_IDP_MONTH)
            { 
              if(this.familyCriteriaCommand.IDP_WEIGHT.DATE_Of_IDP_WAY==='DATE_Of_IDP_WAY_PERCENT')
                 this.addToWeight(this.familyCriteriaCommand.IDP_WEIGHT.DATE_Of_IDP_WAY_PERCENT *(IDpMonths/100) )
              else  if(this.familyCriteriaCommand.IDP_WEIGHT.DATE_Of_IDP_WAY==='DATE_Of_IDP_WAY_FIXED')
                 this.addToWeight(this.familyCriteriaCommand.IDP_WEIGHT.DATE_Of_IDP_WAY_FIXED  )
             
            }
          break;
          case 'DATE_Of_IDP_YEAR':
            let IDpYears=IDpMonths/12;
            if(IDpYears>this.familyCriteriaCommand.IDP_WEIGHT.MIN_DATE_Of_IDP_YEAR)
            { 
              if(this.familyCriteriaCommand.IDP_WEIGHT.DATE_Of_IDP_WAY==='DATE_Of_IDP_WAY_PERCENT')
                 this.addToWeight(this.familyCriteriaCommand.IDP_WEIGHT.DATE_Of_IDP_WAY_PERCENT * (IDpYears/100) )
                 if(this.familyCriteriaCommand.IDP_WEIGHT.DATE_Of_IDP_WAY==='DATE_Of_IDP_WAY_FIXED')
                 this.addToWeight(this.familyCriteriaCommand.IDP_WEIGHT.DATE_Of_IDP_WAY_FIXED  )
             
            }
          break;
        default:
          break;
      }
    }
    //============================================
    calculateWeightByHouse=()=>{
      if(! this.family.currentPlace.house.isOwner)
         this.weight+=this.familyCriteriaCommand.HOUSE_WEIGHT.HOUSE_WEIGHT_OWNER_VALUE;
    }

     //============================================
     calculateWeightByCamp=()=>{
      if( this.family.camp)
         this.weight+=this.familyCriteriaCommand.CAMP_WEIGHT.CAMP_WEIGHT_VALUE;
    }
    
     //============================================
     calculateWeightByIndividuals=()=>{
      // if( this.family.)
      //    this.weight+=this.familyCriteriaCommand.;
    }
     //============================================
    calculateWeightByHelps=()=>{
      // if( this.family.)
      //    this.weight+=this.familyCriteriaCommand.;
    }
      //============================================
      calculateWeightByDisability=()=>{
        // if( this.family.)
        //    this.weight+=this.familyCriteriaCommand.;
      }

      //============================================
      calculateWeightByDiseases=()=>{
        // if( this.family.)
        //    this.weight+=this.familyCriteriaCommand.;
      }
      //============================================
      

    addToWeight(value){
      this.weight+=value;
    }


       // pass old date , return difference between old date and now in months
       dateDiffInMonths(dateOfIDp){
        // Current Time
        var now = new Date()
          // getFullYear function will give current year 
          var currentYear = now.getFullYear()
          // add 1 to get actual month value 
          var month = now.getMonth() 
        let months = (currentYear - new Date(dateOfIDp).getFullYear() )* 12;
        months -= new Date(dateOfIDp).getMonth() ;
        months += month;
    
        return months <= 0 ? 0 : months;
      }
  
  
  
  }
  
  module.exports = apiFamilyCriteria;
  