import { Suspense } from 'react'
import HeroScene from './HeroScene'
import Terminal from './Terminal'
import { useLgUp } from '../../utils/use-media-query'

function SceneFallback() {
    return (
        <div className="absolute inset-0 flex justify-center items-center">
            <span className="text-[#333] text-[10px] uppercase tracking-[3px] animate-pulse">
                Initialising scene...
            </span>
        </div>
    )
}

export default function HeroRight() {
    const showScene = useLgUp()

    return (
        <div className="flex flex-col w-full min-w-0 border-[#1e1e1e] border-t lg:border-t-0 lg:border-l lg:h-full lg:min-h-0">
            {showScene && (
                <div className="relative flex-1 min-h-[220px] bg-[#080808] border-[#1e1e1e] border-b overflow-hidden">
                    <Suspense fallback={<SceneFallback />}>
                        <HeroScene />
                    </Suspense>

                    <div className="top-4 left-4 z-10 absolute flex items-center gap-2">
                        <span className="bg-[#3ddc84] rounded-full w-1.5 h-1.5 animate-pulse" />
                        <span className="text-[#333] text-[9px] uppercase tracking-[2px]">
                            Scene / Active
                        </span>
                    </div>
                </div>
            )}

            <div className="flex-shrink-0 w-full h-[min(42vh,280px)] sm:h-[260px] lg:h-[260px]">
                <Terminal />
            </div>
        </div>
    )
}
