import PlanningSnapshot from '@/components/PlanningSnapshot';
import {master,sales} from '@/lib/data';
import {interviewSnapshot} from '@/lib/interview-snapshot';
export default function Page(){return <PlanningSnapshot snapshot={interviewSnapshot(sales,master)}/>;}
