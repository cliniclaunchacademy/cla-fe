import Image from "next/image";
import discordImg from "@assets/images/discordImg.png";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const invoices = [
  {
    course: "CEO Mindset & Discipline Protocol",
    lesson: "Mental Metamorphosis: Rewiring Your Facilitator’s Mind",
    started: 1,
    completed: 1,
    dropOff: "100%",
  },
  {
    course: "CEO Mindset & Discipline Protocol",
    lesson: "Mental Metamorphosis: Rewiring Your Facilitator’s Mind",
    started: 1,
    completed: 1,
    dropOff: "100%",
  },
  {
    course: "CEO Mindset & Discipline Protocol",
    lesson: "Mental Metamorphosis: Rewiring Your Facilitator’s Mind",
    started: 1,
    completed: 1,
    dropOff: "100%",
  },
]

export default function AdminDashboard() {
  return (
    <section className="w-full flex flex-col gap-y-9 px-9 py-10 ">
      <div className="">
        <h3 className="text-[#EFEFEE] textDisplay40 mb-3 ">Admin Dashboard</h3>
        <p className="text-[#ABADAF] textBody18 ">Platform overview and analytics</p>
      </div>

      <div className="flex flex-col gap-y-6 ">
        {/* High-Level Overview cards */}
        <div>
          <div className="flex gap-2 items-center mb-6 ">
            <span>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.2513 0.916992C8.46825 0.916992 8.68027 0.97828 8.86271 1.09334L8.9388 1.14616L9.01042 1.20435C9.14892 1.32682 9.25595 1.48102 9.32194 1.65373L9.35417 1.75041L13.7513 17.3964L15.2427 12.0907C15.405 11.5122 15.7527 11.0029 16.2319 10.6405C16.7104 10.2785 17.2942 10.0829 17.8942 10.0837H20.168C20.6742 10.0837 21.0846 10.4941 21.0846 11.0003C21.0846 11.5066 20.6742 11.917 20.168 11.917H17.8924C17.6922 11.9166 17.4971 11.9815 17.3374 12.1023C17.2176 12.1929 17.1228 12.3113 17.0599 12.446L17.008 12.5866L14.8542 20.2502L14.8219 20.3469C14.745 20.5483 14.6123 20.7244 14.4388 20.8545C14.2405 21.0033 13.9992 21.0837 13.7513 21.0837C13.5034 21.0837 13.2621 21.0033 13.0638 20.8545C12.8903 20.7244 12.7576 20.5483 12.6807 20.3469L12.6484 20.2502L8.25041 4.60335L6.75993 9.90999C6.59827 10.4862 6.25247 10.9935 5.77612 11.3557C5.29975 11.7179 4.71848 11.9152 4.12004 11.917H1.83464C1.32837 11.917 0.917969 11.5066 0.917969 11.0003C0.917969 10.4941 1.32837 10.0837 1.83464 10.0837H4.11466C4.31413 10.0831 4.50821 10.0173 4.66699 9.89657C4.8257 9.77581 4.94078 9.60609 4.99463 9.41406L7.14844 1.75041L7.18066 1.65373C7.2576 1.45236 7.39035 1.27625 7.5638 1.14616C7.76214 0.997405 8.00338 0.916992 8.2513 0.916992Z" fill="#B88934" />
              </svg>
            </span>
            <p className="text-[#DFE1E3] textDisplay22 ">High-Level Overview</p>
          </div>
          <div className="grid justify-between gap-[34px]
      [grid-template-columns:repeat(1,minmax(0,324px))] 
      sm:[grid-template-columns:repeat(2,minmax(0,324px))] 
      lg:[grid-template-columns:repeat(4,minmax(0,324px))]">
            {/* card */}
            <div className="w-full max-w-[324px] border-2 border-[#26282A] rounded-[16px] bg-[#1C1E20] p-[18px] flex lg:flex-col 2xl:flex-row gap-5 justify-between items-start ">
              <div className="flex flex-col gap-1 ">
                <p className="text-[#ABADAF] textHeading16 ">Total Active Lerners</p>
                <p className="text-[#EFEFEE] textHeading28 !font-bold ">0</p>
                <p className="text-[#ABADAF] textHeading16 ">Logged in within last 30 days</p>
              </div>
              <div className="w-[44px] h-[44px] rounded-full bg-[#2E2D26] flex items-center justify-center text-[#B88934] ">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 8C14 5.79086 12.2091 4 10 4C7.79086 4 6 5.79086 6 8C6 10.2091 7.79086 12 10 12C12.2091 12 14 10.2091 14 8ZM21 20C21 16.9893 19.1864 14.1394 17.4004 12.7998C17.1486 12.611 17 12.3147 17 12C17 11.6854 17.1479 11.3891 17.3994 11.2002C17.9253 10.8056 18.3461 10.2872 18.624 9.69141C18.902 9.09562 19.0287 8.44064 18.9932 7.78418C18.9576 7.12767 18.7607 6.49003 18.4199 5.92773C18.0792 5.36553 17.6054 4.89594 17.04 4.56055C16.565 4.27881 16.4077 3.66447 16.6895 3.18945C16.9712 2.71452 17.5856 2.55813 18.0605 2.83984C18.9086 3.34291 19.6198 4.04733 20.1309 4.89062C20.642 5.73409 20.9368 6.69098 20.9902 7.67578C21.0436 8.66055 20.8535 9.64336 20.4365 10.5371C20.1926 11.0599 19.8732 11.5405 19.4941 11.9697C21.3667 13.7926 23 16.777 23 20C23 20.5523 22.5523 21 22 21C21.4477 21 21 20.5523 21 20ZM16 8C16 9.94598 15.0726 11.6742 13.6367 12.7705C14.6434 13.2154 15.571 13.8424 16.3643 14.6357C18.0521 16.3236 19 18.6131 19 21C19 21.5523 18.5523 22 18 22C17.4477 22 17 21.5523 17 21C17 19.1435 16.2629 17.3626 14.9502 16.0498C13.6374 14.7371 11.8565 14 10 14C8.14348 14 6.36256 14.7371 5.0498 16.0498C3.73705 17.3626 3 19.1435 3 21C3 21.5523 2.55228 22 2 22C1.44772 22 1 21.5523 1 21C1 18.6131 1.94791 16.3236 3.63574 14.6357C4.42882 13.8427 5.35593 13.2153 6.3623 12.7705C4.92681 11.6742 4 9.9457 4 8C4 4.68629 6.68629 2 10 2C13.3137 2 16 4.68629 16 8Z" fill="#B88934" />
                </svg>
              </div>
            </div>
            {/* card */}
            <div className="w-full max-w-[324px] border-2 border-[#26282A] rounded-[16px] bg-[#1C1E20] p-[18px] flex lg:flex-col 2xl:flex-row gap-5 justify-between items-start ">
              <div className="flex flex-col gap-1 ">
                <p className="text-[#ABADAF] textHeading16 ">Course Completion Rate</p>
                <p className="text-[#EFEFEE] textHeading28 !font-bold ">0%</p>
                <p className="text-[#ABADAF] textHeading16 ">Users who start and finish a course</p>
              </div>
              <div className="w-[44px] h-[44px] rounded-full bg-[#2E2D26] flex items-center justify-center text-[#B88934] ">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.9999 13C22.9999 13.5523 22.5522 14 21.9999 14C21.4476 14 20.9999 13.5523 20.9999 13V9.41406L14.207 16.207C13.8164 16.5976 13.1834 16.5976 12.7929 16.207L8.49992 11.9141L2.70696 17.707C2.31643 18.0976 1.68342 18.0976 1.29289 17.707C0.902369 17.3165 0.902369 16.6835 1.29289 16.293L7.79289 9.79297L7.86907 9.72461C8.26184 9.40426 8.84084 9.42685 9.20696 9.79297L13.4999 14.0859L19.5859 8H15.9999C15.4476 8 14.9999 7.55228 14.9999 7C14.9999 6.44772 15.4476 6 15.9999 6H21.9999C22.5522 6 22.9999 6.44772 22.9999 7V13Z" fill="#B88934" />
                </svg>
              </div>
            </div>
            {/* card */}
            <div className="w-full max-w-[324px] border-2 border-[#26282A] rounded-[16px] bg-[#1C1E20] p-[18px] flex lg:flex-col 2xl:flex-row gap-5 justify-between items-start ">
              <div className="flex flex-col gap-1 ">
                <p className="text-[#ABADAF] textHeading16 ">Total User</p>
                <p className="text-[#EFEFEE] textHeading28 !font-bold ">4</p>
                <p className="text-[#ABADAF] textHeading16 ">1 new user this week</p>
              </div>
              <div className="w-[44px] h-[44px] rounded-full bg-[#2E2D26] flex items-center justify-center text-[#B88934] ">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 4C15.2044 4 14.4415 4.3163 13.8789 4.87891C13.3163 5.44152 13 6.20435 13 7V17.5371C13.603 17.1889 14.2916 17 15 17H21V4H16ZM3 17H9C9.70844 17 10.397 17.1889 11 17.5371V7C11 6.20435 10.6837 5.44152 10.1211 4.87891C9.55849 4.3163 8.79565 4 8 4H3V17ZM23 17C23 17.5304 22.7891 18.039 22.4141 18.4141C22.039 18.7891 21.5304 19 21 19H15C14.4696 19 13.961 19.2109 13.5859 19.5859C13.2109 19.961 13 20.4696 13 21C13 21.5523 12.5523 22 12 22C11.4477 22 11 21.5523 11 21C11 20.4696 10.7891 19.961 10.4141 19.5859C10.039 19.2109 9.53043 19 9 19H3C2.46957 19 1.96101 18.7891 1.58594 18.4141C1.21086 18.039 1 17.5304 1 17V4C1 3.46957 1.21086 2.96101 1.58594 2.58594C1.96101 2.21086 2.46957 2 3 2H8C9.32608 2 10.5975 2.52716 11.5352 3.46484C11.7036 3.63332 11.8587 3.81256 12 4.00098C12.1413 3.81256 12.2964 3.63332 12.4648 3.46484C13.4025 2.52716 14.6739 2 16 2H21C21.5304 2 22.039 2.21086 22.4141 2.58594C22.7891 2.96101 23 3.46957 23 4V17Z" fill="#B88934" />
                </svg>
              </div>
            </div>
            {/* card */}
            <div className="w-full max-w-[324px] border-2 border-[#26282A] rounded-[16px] bg-[#1C1E20] p-[18px] flex lg:flex-col 2xl:flex-row gap-5 justify-between items-start ">
              <div className="flex flex-col gap-1 ">
                <p className="text-[#ABADAF] textHeading16 ">Lesson Completions</p>
                <p className="text-[#EFEFEE] textHeading28 !font-bold ">1</p>
                <p className="text-[#ABADAF] textHeading16 ">43 total progress records</p>
              </div>
              <div className="w-[44px] h-[44px] rounded-full bg-[#2E2D26] flex items-center justify-center text-[#B88934] ">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12ZM11 6C11 5.44772 11.4477 5 12 5C12.5523 5 13 5.44772 13 6V11.3818L16.4473 13.1055C16.9412 13.3525 17.1415 13.9533 16.8945 14.4473C16.6475 14.9412 16.0467 15.1415 15.5527 14.8945L11.5527 12.8945C11.214 12.7251 11 12.3788 11 12V6ZM23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12Z" fill="#B88934" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        {/* Enrolment / Sign-up Trends graph */}
        <div>
          <Accordion
            type="single"
            collapsible
            defaultValue="shipping"
            className="w-full bg-[#181818] border-2 border-[#2E2D26] rounded-[16px] p-8 "
          >
            <AccordionItem value="shipping">
              <AccordionTrigger>
                <div className="flex items-center gap-3 ">
                  <div className="w-fit h-[21px] border-2 border-[#B88934] rounded-[1px] "></div>
                  <p className="text-[#DFE1E3] textDisplay22 ">Enrolment / Sign-up Trends</p></div>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-[#ABADAF] textBody16 mb-8 ">New sign-ups over last 7 days</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* Content & Engagement Analytics */}
      <div>
        <div className="flex gap-2 items-center mb-6 ">
          <span>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.83203 17.4173V2.75065C1.83203 2.24439 2.24244 1.83398 2.7487 1.83398C3.25496 1.83398 3.66536 2.24439 3.66536 2.75065V17.4173C3.66536 17.6604 3.76201 17.8935 3.93392 18.0654C4.10583 18.2373 4.33892 18.334 4.58203 18.334H19.2487C19.755 18.334 20.1654 18.7444 20.1654 19.2507C20.1654 19.7569 19.755 20.1673 19.2487 20.1673H4.58203C3.85269 20.1673 3.15342 19.8774 2.6377 19.3617C2.12197 18.8459 1.83203 18.1467 1.83203 17.4173ZM6.41536 15.584V12.834C6.41536 12.3277 6.82577 11.9173 7.33203 11.9173C7.83829 11.9173 8.2487 12.3277 8.2487 12.834V15.584C8.2487 16.0902 7.83829 16.5007 7.33203 16.5007C6.82577 16.5007 6.41536 16.0902 6.41536 15.584ZM10.9987 15.584V8.25065C10.9987 7.74439 11.4091 7.33398 11.9154 7.33398C12.4216 7.33398 12.832 7.74439 12.832 8.25065V15.584C12.832 16.0902 12.4216 16.5007 11.9154 16.5007C11.4091 16.5007 10.9987 16.0902 10.9987 15.584ZM15.582 15.584V4.58398C15.582 4.07772 15.9924 3.66732 16.4987 3.66732C17.005 3.66732 17.4154 4.07772 17.4154 4.58398V15.584C17.4154 16.0902 17.005 16.5007 16.4987 16.5007C15.9924 16.5007 15.582 16.0902 15.582 15.584Z" fill="#B88934" />
            </svg>
          </span>
          <p className="text-[#DFE1E3] textDisplay22 ">Content & Engagement Analytics</p>
        </div>
        <div>
          <Accordion
            type="single"
            collapsible
            defaultValue="shipping"
            className="w-full bg-[#181818] border-2 border-[#2E2D26] rounded-[16px] p-8 "
          >
            <AccordionItem value="shipping">
              <AccordionTrigger>
                <div className="flex items-center gap-3 ">
                  <div className="w-fit h-[21px] border-2 border-[#B88934] rounded-[1px] ">
                  </div>
                  <p className="text-[#DFE1E3] textDisplay22 ">Drop-off Points</p>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-[#ABADAF] textBody16 mb-8 ">Modules/lessons where users stop most often</p>

                <Table className="text-[#ABADAF]  ">
                  <TableHeader className="textLabel16 ">
                    <TableRow className="border-b border-[#26282A] ">
                      <TableHead className="w-[100px]">Course</TableHead>
                      <TableHead>Lesson</TableHead>
                      <TableHead className="text-right">Started</TableHead>
                      <TableHead className="text-right">Completed</TableHead>
                      <TableHead className="text-right">Drop-off</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="textBody16 ">
                    {invoices.map((invoice, index) => (
                      <TableRow key={index} className="border-b border-transparent hover:bg-[#26282A] transition duration-300">
                        <TableCell className="">{invoice.course}</TableCell>
                        <TableCell className="">{invoice.lesson}</TableCell>
                        <TableCell className="text-right">{invoice.started}</TableCell>
                        <TableCell className="text-right">{invoice.completed}</TableCell>
                        <TableCell className="text-right text-[#B88934] ">{invoice.dropOff}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
}
