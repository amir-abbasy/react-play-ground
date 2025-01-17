import { memo, useEffect } from 'react';
import {
    Handle,
    Position,
    useEdges,
    useHandleConnections,
    useNodesData,
} from '@xyflow/react';
import { ValueNode, MathNode } from './Math'
import { IndicatorNode } from './Indicators'
import { HHLLNode } from './hhll'
import CoinNode from './CoinNode'
import setVal from '../setValue'

const CustomNode = ({ data, id, updateNode }) => {
    // Handler for input changes
    const onInputChange = (event) => {
        updateNode(id, event.target.value);
    };

    return (
        <div style={{ padding: '10px', border: '1px solid black', borderRadius: '5px', width: '200px', backgroundColor: '#eeeeee' }}>
            <div>{data.label}</div>
            <input
                type="text"
                value={data.value || ''}
                onSelect={onInputChange}
                placeholder="Enter value"
                style={{ width: '100%' }}
                id={'input-' + id}
            />
            {/* Input Handles */}
            {/* <Handle
                type="target"
                position="top"
                id="input-1" // Unique id for this handle
                style={{ background: 'blue' }}
            /> */}
            <Handle
                type="target"
                position="left"
                id={'target-' + id} // Another unique id
                style={{ background: 'orange' }}
            />

            {/* Output Handles */}
            {/* <Handle
                type="source"
                position="bottom"
                id="output-1" // Unique id for the output handle
                style={{ background: 'red' }}
            /> */}
            <Handle
                type="source"
                position="right"
                id={'source-' + id} // Another unique id
                style={{ background: 'green' }}
            />

        </div>
    );
};



const OPTIONS = [
    { value: null, name: "SELECT" },
    { value: "<", name: "< Less Than" },
    { value: "<=", name: "<= Less Than or Equal To" },
    { value: "!=", name: "!= Not Equal" },
    { value: "==", name: "== Equal" },
    { value: ">", name: "> Greater Than" },
    { value: ">=", name: ">= Greater Than or Equal To" }]

const ConditionNode = memo(({ data, id, updateNode }) => {
    // SOURCES 
    const edges = useEdges().filter(_ => _.target == id)
    const nodesData = useNodesData(
        edges.map((connection) => connection.source),
    );


    const getVal = (INPUT_ID = 1) => {
        const edge = edges.filter(e => e.targetHandle == INPUT_ID)?.[0]
        const val = nodesData.filter(e => e.id == edge?.source)?.[0]

        if (!val?.data) return null
        return val.data.value[edge.sourceHandle]
    }

    // Handler for input changes
    const onInputChange = (event) => {
        updateNode(id, setVal(data.value, 2, event.target.value));
    };

    useEffect(() => {
        updateNode(id, setVal(data.value, 0, getVal(0) ?? null))
        updateNode(id, setVal(data.value, 1, getVal(1) ?? null))
    }, [edges])


    return <div
        className="bg-gray-200 min-w-64 border rounded-xl py-2 border-black flex flex-col justify-center">
        <label className="px-4">{data.label}</label>

        <select
            type="text"
            value={data.value[2] || ''}
            onChange={onInputChange}
            placeholder="Enter value"
            className="bg-white p-2 mx-2 rounded-xl"
        >
            {OPTIONS?.map((option, optIndex) => (
                <option key={optIndex} value={option.value}>
                    {option.name}
                </option>
            ))}

        </select>

        {/* INPUT*/}

        <div className="relative  items-center m-2">
            <Handle
                type="target"
                position={Position.Left}
                id={"0"} // Another unique id
                style={{ background: 'orange', width: 15, height: 15 }}
            />
            <p className='text-xs'>0</p>
            <p className="px-4">{getVal(0) ?? 'Value 1'}</p>
        </div>


        <div className="relative  items-center m-2">
            <Handle
                type="target"
                position={Position.Left}
                // id={'target-2-' + id} // Another unique id
                id={'1'} // Another unique id
                style={{ background: 'orange', width: 15, height: 15 }}
            />
            <p className='text-xs'>1</p>
            <p className="px-4">{getVal(1) ?? 'Value 2'}</p>
        </div>




        {/* OUTPUT */}
        <Handle
            type="source"
            position={Position.Right}
            id={'source-' + id} // Another unique id
            style={{ background: 'violet', width: 15, height: 15 }}
        />



    </div>
})


export { CoinNode, ConditionNode, CustomNode, ValueNode, MathNode, IndicatorNode, HHLLNode }