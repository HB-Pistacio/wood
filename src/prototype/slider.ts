type Args = {
  parentId: string;
  label: string;
  initialValue?: number;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
};

export function slider({
  parentId,
  label,
  initialValue,
  min,
  max,
  onChange,
}: Args) {
  const parent = document.querySelector(parentId);
  if (parent === null) {
    throw new Error(`No element with id '${parentId}' found`);
  }

  const elem = document.createElement("div");
  elem.innerHTML = `
    <div style='display: flex; margin-bottom: 8px;'>
     <label for='slider-${label}' style='margin-right: 8px'>${label}</label>
      <input id='slider-${label}' type='range' value='${
    initialValue ?? 0
  }' min='${min ?? 0}'  max='${max ?? 0}'/>
    </div>
  `;

  const slider = elem.querySelector(`#slider-${label}`);
  if (onChange !== undefined && slider !== null) {
    slider.addEventListener("input", (e) =>
      onChange((e.target as any)?.value ?? 0)
    );
  }

  parent.appendChild(elem);
}
