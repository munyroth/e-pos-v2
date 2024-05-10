export default function Empty(props) {
    const {title} = props;

    return (
        <div className="flex items-center justify-center h-full dark:text-white">
            មិនមាន{title}ទេ
        </div>
    );
}