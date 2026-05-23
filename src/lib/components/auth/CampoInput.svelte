<script lang="ts">
    interface Props {
        label: string;
        type: 'text' | 'username' | 'email' | 'password' | 'number' | 'tel';
        value: string;
        id?: string;
        autocomplete?: string;
        required?: boolean;
        minLength?: number;
        maxLength?: number;
        placeholder?: string;
        isError?: boolean;
        isSuccess?: boolean;
        name?: string;
        oninput?: (e: Event) => void;
    }

    let {
        label,
        type,
        value = $bindable(),
        id,
        autocomplete,
        required = false,
        minLength,
        maxLength,
        placeholder,
        isError = false,
        isSuccess = false,
        name,
        oninput
    }: Props = $props();

    let borderColorClass = $derived.by(() => {
        if (isSuccess) {
            return 'border-green-500 focus:border-green-500 focus:shadow-[0_0_5px_rgba(0,255,0,0.3)] bg-green-50';
        } else if (isError) {
            return 'border-red-500 focus:border-red-500 focus:shadow-[0_0_5px_rgba(255,0,0,0.3)] bg-red-50';
        }
        return 'border-gray-300 focus:border-[#007bff] focus:shadow-[0_0_5px_rgba(0,123,255,0.3)]';
    });
</script>

<div class="mb-4 text-left">
    <label for={id} class="mb-2 block font-bold text-[#555]">{label}</label>

    <input
        {id}
        class="w-full rounded-lg border px-4 py-3 text-base transition duration-300 focus:outline-none {borderColorClass}"
        type={type === 'username' ? 'text' : type}
        autoComplete={autocomplete}
        bind:value
        {required}
        {minLength}
        {maxLength}
        {placeholder}
        {name}
        {oninput}
    />
</div>
