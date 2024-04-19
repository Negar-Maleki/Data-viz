import React, { useContext } from "react";
import { DataContext } from "../service/provider/DataProvider";

// function treeSelectMenu() {
//   const data = useContext(DataContext);
//   const topics = data.map((item) => {
//     const topic = item.annotations.topic;
//     return topic;
//   });
//   const uniqueTopics = [...new Set(topics.flat())];
//   const topicNodes = uniqueTopics.map((topic, index) => ({
//     key: index,
//     label: topic,
//   }));
// }


cubes: 
  {
    
    annotations: {
         topic: "Housing & Living",
      subtopic: "Income",
    },
    dimensions: [
      {
        name: "Geography",
        caption: "Geography",
       
        
      },
      {
        name: "Year",
        caption: "Year",
        
     
      },

    measures: [
      {
        name: "Household Income",
        caption: "Household Income",
        annotations: {
          aggregation_method: "SUM",
         
        },
        full_name: "[Measures].[Household Income]",
        aggregator: "SUM",
      },
      {
        name: "Household Income Moe",
        caption: "Household Income Moe",
        annotations: {
          error_for_measure: "Household Income",
          error_type: "MOE",
        },
        full_name: "[Measures].[Household Income Moe]",
        aggregator: "UNKNOWN",
      },
    ],
  }