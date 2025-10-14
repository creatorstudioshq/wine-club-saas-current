# Wine Club SaaS

## Overview

This is a wine club saas for Square wine clubs. King Frosch is client #1 and will not have a client billing plan. Future clients will pay a monthly fee not determined. 

## Getting Started


This project was started in Figma. It needs to have dependecies installed, to be converted to Next.JS application. The code needs a complete audit for functionality. The primary concern is the square inventory API is not pulling in the entire collection from the Square account API which maybe hard coded into the inventory page. There is no need for inventory to be on the sandbox url becasue we aren't editing the inventory or saving it. The inventory are called items by Square and the item as a whole the collection. Items have meta data common in e-commerce, but pictures are considered related objects. The get call to the collection seems to be working, but there are over a 100 items and only 8 displayed. Square does recommend pagination over 50, but we should paginate in quantities of 24 or less as long as a multiple of 3. Categories can be assigned to customer preference grouping as a filter at the users discretion. i.e. Red and White Dry Wine. The wine club is free for this club. Customers sign up on a page where plans are embedded, they choose a plan level, and then should be allowed to enter a payment method that is saved in Square in the customer profile or record. All customers need to select a preference which determines the wines in their club shipment, but some choose a Fixed Custom preference allowing the same wines to be shipped each time. The owner creates shipments which are a matrix of wines that match the preference group and plan quantity. In the King Frosch Wine Club that is 3, 6, or 12 wines per shipment on a 2, 3, 4, or 6 month frequency chosen by the customer. Customers get an email 7 days before a shipment to swap wines and confirm their shipment date or delay shipment by up to two weeks. All club options should be variables that other club owners can modify. Customers can sign up anytime, should be able to select their initial suggested wines. Then customers are in the cycle of shipments with their iniital shipment being the monthly anniversary date to determine bow often from that date shipments occure indefinetly until cancelled. King Frosch ships club wines the third Wednesday of the month to all members expecting a shipment. This is the first instance so members will need to be imported and their plans assigned. After that members sign up from the Square club site. Users receive their wine selection 7 days in advance via email and or SMS via strip with a unique link they can open without login, approve or swap the wines they want, then confirm the shipment date or delay 1-2 weeks to allow for vacations. Then when they confirm a date tehy are asked to put payment information in or in the future update if expired. Once paymnent and a shipment date is confirmed, the member card is charged via the Square payment api, payment record stored in Square, and an email receipt sent out. 

The SaaS admin is started but not completed. For now it needs to be able to show the wine club and their shipment information for support and that is about all for now. 
Read the readme.md and review the code and modify any code needed to fulfill. 

ROADMAP.MD has instructions on what to work on.

## Cursor AI = Agent


## Important: Agent Memory Refresh Protocol

1. **Read this README.md in the root not /src completely** every 15 minutes.
2. **When finished, then Read ROADMAP.md in root, not src** to understand the project and get approval from user with next steps. All new features or changes recommended should be in this file which is similar to a PRD, except this app is almost complete. 
3. **After reading README + ROADMAP:**
   - Give me a status update. 
   - **Call me "Big Poppa J"** all the time. 
   - Tell me what is finished, if anything needs my approval, any issues or what's next.
   - Proceed with your normal protocol . 

**Agent Change Log Protocol**

1. **Make changelog entries in Changelog.md when:**
   - On github commits. 
   - No more than 15 minutes apart 

2. **Changelog format:**
   \`\`\`
   ## [Date/Time CST] - [Stage Name]
   - Change 1
   - Change 2
   - Change 3
   Memory: XX% of max
   \`\`\`

3. After change logs follow the Agent Memory Refresh Protocol 

## Features

[Add feature list here]

## Contributing

[Add contribution guidelines here]

## License

[Add license information here]# Force deployment Tue Oct 14 15:40:26 CDT 2025
