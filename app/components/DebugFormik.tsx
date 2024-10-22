export default function DebugFormik(formikState: any) {
console.log(formikState);

    return (
        <div>
            <span>
                {JSON.stringify(formikState, null, 2)}
            </span>
        </div>
    )
}