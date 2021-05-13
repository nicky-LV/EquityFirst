import { ArrowSmDownIcon, ArrowSmUpIcon } from '@heroicons/react/solid'
import StatsRow from "./statsRow";

const stats = [
    { name: 'Total Subscribers', stat: '71,897', previousStat: '70,946', change: '12%', changeType: 'increase' },
    { name: 'Avg. Open Rate', stat: '58.16%', previousStat: '56.14%', change: '2.02%', changeType: 'increase' },
    { name: 'Avg. Open Rate', stat: '58.16%', previousStat: '56.14%', change: '2.02%', changeType: 'increase' },
    { name: 'Avg. Open Rate', stat: '58.16%', previousStat: '56.14%', change: '2.02%', changeType: 'increase' },

]



export default function TechnicalStats() {
    return (
        <div>
            <div className="mt-3 rounded-lg bg-white divide-y-0 lg:divide-y border">
                <StatsRow pair={[stats[0], stats[1]]} />
                <StatsRow pair={[stats[0], stats[1]]} />
                <StatsRow pair={[stats[0], stats[1]]} />
            </div>
        </div>
    )
}
