import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Check from "@mui/icons-material/Check";
import Pause from "@mui/icons-material/PauseRounded";
import ErrorIcon from "@mui/icons-material/Error";

import type { CircularProgressProps } from "@mui/material/CircularProgress";

//================================================

const fractionOfSize = (size: number | string | undefined, denominator: number, asPx?: boolean) => {
  if (typeof size === "number" || !isNaN(Number(size))) {
    const value = Number(size) / denominator;
    return asPx ? `${value}px` : value;
  }
  if (typeof size === "string") {
    return `calc(${size} / ${denominator})`;
  }
};

export type ProgressIndicatorProps = Omit<CircularProgressProps, "variant"> & {
  variant?: "linear" | "circular";
  total?: number;
  tooltipText?: string | React.ReactElement;
  labelText?: string | React.ReactElement;
  paused?: boolean;
  error?: Error;
};

export function ProgressIndicator({
  variant = "linear",
  value,
  total,
  tooltipText,
  labelText,
  size,
  paused,
  error,
  ...props
}: ProgressIndicatorProps) {
  const scaledValue =
    value != null
      ? Math.min(100, Math.max(0, total != null && value >= 0 ? (100 * value) / total : value))
      : undefined;
  const progressProps = {
    variant: !error && (value == null || value < 0) ? "indeterminate" : "determinate",
    value: scaledValue,
    color: paused
      ? "warning"
      : error
        ? "error"
        : scaledValue != null && scaledValue >= 100
          ? "success"
          : undefined,
    size,
  } as const;

  const withTooltip = (content: React.ReactElement | string) => (
    <Tooltip title={error?.message ?? tooltipText}>
      {typeof content === "string" ? <span>{content}</span> : content}
    </Tooltip>
  );

  if (variant === "circular") {
    return withTooltip(
      <Grid position="relative" height={size} width={fractionOfSize(size, 0.25)}>
        <CircularProgress
          sx={{ position: "absolute", color: theme => theme.palette.background.layer }}
          variant="determinate"
          value={100}
          size={size}
        />
        <CircularProgress {...props} {...progressProps} />
        <Grid
          container
          sx={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            right: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {paused ? (
            <Pause />
          ) : error ? (
            <ErrorIcon color="error" />
          ) : progressProps.value != null && progressProps.value >= 100 ? (
            <Check />
          ) : progressProps.value != null ? (
            <Typography variant="caption" color="textSecondary" lineHeight={0}>
              {Math.round(progressProps.value)}%
            </Typography>
          ) : undefined}
        </Grid>
      </Grid>,
    );
  }

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      direction="column"
      p={4}
      spacing={3}
      width={fractionOfSize(size, 0.25)}
    >
      {labelText != null && (
        <Typography variant="caption">
          {tooltipText ? withTooltip(labelText) : labelText}
        </Typography>
      )}
      <LinearProgress
        {...props}
        {...progressProps}
        sx={{
          width: "100%",
          height: fractionOfSize(size, 12, true),
          borderRadius: fractionOfSize(size, 36, true),
        }}
      />
    </Grid>
  );
}
